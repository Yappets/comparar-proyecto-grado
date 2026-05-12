import { Request, Response } from "express";

/* ======================================================
   CONFIG
====================================================== */

const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY;

/* ======================================================
   HELPERS
====================================================== */

const normalizarTexto = (texto: string = ""): string => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const obtenerPartesBusqueda = (query: string) => {
  const partes = query.trim().split(/\s+/);
  const ultimo = partes[partes.length - 1];

  const numero = /^\d+$/.test(ultimo) ? ultimo : undefined;

  const calle = numero
    ? partes.slice(0, -1).join(" ")
    : query.trim();

  return {
    calle: calle.trim(),
    numero,
  };
};

const obtenerNombreCalle = (item: any, fallback: string): string => {
  return (
    item.address?.road ||
    item.address?.pedestrian ||
    item.address?.footway ||
    item.address?.residential ||
    item.display_place ||
    fallback
  );
};

const obtenerNumeroDireccion = (item: any): string => {
  return item.address?.house_number || "";
};

const esSaltaCapital = (item: any): boolean => {
  const texto = normalizarTexto(
    [
      item.display_name,
      item.display_address,
      item.address?.city,
      item.address?.town,
      item.address?.municipality,
      item.address?.county,
      item.address?.state,
      item.address?.country,
    ]
      .filter(Boolean)
      .join(" ")
  );

  return (
    texto.includes("argentina") &&
    texto.includes("salta") &&
    (
      texto.includes("capital") ||
      texto.includes("salta, salta") ||
      texto.includes("salta capital")
    )
  );
};

const formatearDireccionVisible = (
  item: any,
  calleFallback: string
): string => {
  const calle = obtenerNombreCalle(item, calleFallback);
  const numero = obtenerNumeroDireccion(item);

  const ciudad =
    item.address?.city ||
    item.address?.town ||
    item.address?.municipality ||
    "Salta";

  const provincia = item.address?.state || "Salta";
  const pais = item.address?.country || "Argentina";
  const codigoPostal = item.address?.postcode || "4400";

  const base = numero ? `${calle} ${numero}` : calle;

  return `${base}, ${ciudad}, Capital, ${provincia}, ${codigoPostal}, ${pais}`;
};

const transformarResultado = (
  item: any,
  calleFallback: string
) => {
  const direccionVisible = formatearDireccionVisible(item, calleFallback);

  return {
    lat: String(item.lat),
    lon: String(item.lon),
    display_name: direccionVisible,
    full_address: item.display_name || direccionVisible,
    address: {
      road: obtenerNombreCalle(item, calleFallback),
      house_number: obtenerNumeroDireccion(item),
      city:
        item.address?.city ||
        item.address?.town ||
        item.address?.municipality ||
        "Salta",
      county: item.address?.county || "Capital",
      state: item.address?.state || "Salta",
      postcode: item.address?.postcode || "4400",
      country: item.address?.country || "Argentina",
    },
    locationiq: item,
  };
};

const quitarDuplicados = (items: any[]): any[] => {
  const mapa = new Map<string, any>();

  for (const item of items) {
    const key = normalizarTexto(`${item.lat}-${item.lon}-${item.display_name}`);

    if (!mapa.has(key)) {
      mapa.set(key, item);
    }
  }

  return Array.from(mapa.values());
};

/* ======================================================
   LOCATIONIQ AUTOCOMPLETE
====================================================== */

const buscarEnLocationIQ = async (query: string): Promise<any[]> => {
  if (!LOCATIONIQ_API_KEY) {
    console.error("Falta configurar LOCATIONIQ_API_KEY");
    return [];
  }

  const textoBusqueda = `${query}, Salta Capital, Salta, Argentina`
    .replace(/\s+/g, " ")
    .trim();

  const params = new URLSearchParams({
    key: LOCATIONIQ_API_KEY,
    q: textoBusqueda,
    limit: "8",
    countrycodes: "ar",
    normalizecity: "1",
    "accept-language": "es",
  });

  const url = `https://api.locationiq.com/v1/autocomplete?${params.toString()}`;

  console.log("LocationIQ autocomplete:", textoBusqueda);

  const response = await fetch(url);
  const text = await response.text();

  if (!response.ok) {
    console.error("LocationIQ autocomplete error:", text);
    return [];
  }

  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("LocationIQ JSON parse error:", error);
    return [];
  }
};

/* ======================================================
   REVERSE GEOCODE
   Se usa cuando movés el pin
====================================================== */

export const reverseGeocode = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    res.status(400).json({ error: "Parámetros lat y lon requeridos" });
    return;
  }

  if (!LOCATIONIQ_API_KEY) {
    res.json({ display_name: "Ubicación seleccionada" });
    return;
  }

  try {
    const params = new URLSearchParams({
      key: LOCATIONIQ_API_KEY,
      lat: String(lat),
      lon: String(lon),
      format: "json",
      addressdetails: "1",
      normalizecity: "1",
      "accept-language": "es",
    });

    const url = `https://us1.locationiq.com/v1/reverse?${params.toString()}`;

    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      console.error("LocationIQ reverse error:", text);
      res.json({ display_name: "Ubicación seleccionada" });
      return;
    }

    const data = JSON.parse(text);

    const resultado = transformarResultado(
      data,
      "Ubicación seleccionada"
    );

    res.json(resultado);
  } catch (error: any) {
    console.error("Reverse LocationIQ catch:", error);
    res.json({ display_name: "Ubicación seleccionada" });
  }
};

/* ======================================================
   BUSCAR DIRECCIÓN
   Se usa cuando escribís en el buscador
====================================================== */

export const buscarDireccion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    res.status(400).json({ error: "Parámetro 'q' requerido" });
    return;
  }

  const query = q.trim();

  if (query.length < 3) {
    res.json([]);
    return;
  }

  try {
    const { calle } = obtenerPartesBusqueda(query);

    if (calle.length < 2) {
      res.json([]);
      return;
    }

    const resultadosLocationIQ = await buscarEnLocationIQ(query);

    const resultados = resultadosLocationIQ
      .filter((item: any) => esSaltaCapital(item))
      .map((item: any) => transformarResultado(item, calle));

    const unicos = quitarDuplicados(resultados).slice(0, 5);

    res.json(unicos);
  } catch (error: any) {
    console.error("ERROR buscarDireccion LocationIQ:", error);
    res.json([]);
  }
};