import { Request, Response } from "express";

/* ======================================================
   HELPERS
====================================================== */

// Normaliza texto para comparar direcciones sin depender de mayúsculas, acentos o espacios duplicados.
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

  // Se toma como altura solo el último número.
  // Esto permite buscar calles como "12 de Octubre 1564" sin interpretar "12" como altura.
  const numero = /^\d+$/.test(ultimo) ? ultimo : undefined;

  const calle = numero
    ? partes.slice(0, -1).join(" ")
    : query.trim();

  return {
    calle: calle.trim(),
    numero,
  };
};

const esSaltaCapital = (item: any): boolean => {
  const display = normalizarTexto(item.display_name || "");

  const city = normalizarTexto(
    item.address?.city ||
      item.address?.town ||
      item.address?.municipality ||
      ""
  );

  const county = normalizarTexto(item.address?.county || "");
  const state = normalizarTexto(item.address?.state || "");

  // Restringe los resultados a Salta Capital para evitar sugerencias de otras localidades.
  return (
    state.includes("salta") &&
    (
      city.includes("salta") ||
      county.includes("capital") ||
      display.includes("salta, capital")
    )
  );
};

const obtenerNombreCalle = (item: any, calleFallback: string): string => {
  return (
    item.address?.road ||
    item.address?.pedestrian ||
    item.address?.footway ||
    item.address?.residential ||
    calleFallback
  );
};

const obtenerNumeroDireccion = (item: any): string => {
  const houseNumber = item.address?.house_number;

  if (houseNumber) {
    return String(houseNumber);
  }

  const display = item.display_name || "";

  // Fallback para casos donde Nominatim devuelve la altura al inicio del display_name.
  const match = display.match(/^\s*(\d+[a-zA-Z]*)\s*,/);

  return match ? match[1] : "";
};

const formatearDireccionVisible = (
  item: any,
  calleFallback: string
): string => {
  const calle = obtenerNombreCalle(item, calleFallback);

  // Solo se utiliza una altura devuelta por Nominatim para evitar mostrar direcciones inventadas.
  const numero = obtenerNumeroDireccion(item);

  const base = numero ? `${calle} ${numero}` : calle;

  return `${base}, Salta, Capital, Salta, 4400, Argentina`;
};

const quitarDuplicados = (items: any[]): any[] => {
  const mapa = new Map<string, any>();

  for (const item of items) {
    const key = `${item.lat}-${item.lon}-${item.display_name}`;
    if (!mapa.has(key)) {
      mapa.set(key, item);
    }
  }

  return Array.from(mapa.values());
};

/* ======================================================
   NOMINATIM SEARCH EN PARALELO
====================================================== */

const buscarEnNominatim = async (consulta: string): Promise<any[]> => {
  const consultaLimpia = consulta.replace(/\s+/g, " ").trim();

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    consultaLimpia
  )}&countrycodes=ar&limit=5&addressdetails=1`;

  console.log("URL:", url);

  const response = await fetch(url, {
    headers: {
      // Nominatim requiere identificar la aplicación mediante User-Agent.
      "User-Agent": "tesis-app (tuemail@dominio.com)",
      "Accept-Language": "es",
    },
  });

  const text = await response.text();

  if (!response.ok) {
    console.error("Nominatim error:", text);
    return [];
  }

  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("JSON parse error:", error);
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

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "tesis-app (tuemail@dominio.com)",
          "Accept-Language": "es",
        },
      }
    );

    if (!response.ok) {
      console.error("Reverse error:", await response.text());
      res.json({ display_name: "Ubicación actual" });
      return;
    }

    const data = await response.json();

    // Se muestra una dirección corta al usuario, pero se conserva la dirección completa.
    const direccionVisible = formatearDireccionVisible(
      data,
      "Ubicación seleccionada"
    );

    res.json({
      ...data,
      display_name: direccionVisible,
      full_address: data.display_name,
    });
  } catch (error: any) {
    console.error("Reverse catch:", error);
    res.json({ display_name: "Ubicación actual" });
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
    const { calle, numero } = obtenerPartesBusqueda(query);

    if (calle.length < 2) {
      res.json([]);
      return;
    }

    const calleNormalizada = normalizarTexto(calle);

    // Se generan variantes para mejorar la búsqueda sin depender de que el usuario escriba "Av.", "Avenida" o "Calle".
    const consultas = [
      `${calle} ${numero || ""}, Salta Capital, Salta, Argentina`,
      `Avenida ${calle} ${numero || ""}, Salta Capital, Salta, Argentina`,
      `Av ${calle} ${numero || ""}, Salta Capital, Salta, Argentina`,
      `Calle ${calle} ${numero || ""}, Salta Capital, Salta, Argentina`,
    ];

    const consultasUnicas = Array.from(
      new Set(consultas.map((c) => c.replace(/\s+/g, " ").trim()))
    );

    // Las consultas se ejecutan en paralelo para reducir el tiempo de respuesta.
    const respuestas = await Promise.allSettled(
      consultasUnicas.map((consulta) => buscarEnNominatim(consulta))
    );

    const resultadosTotales = respuestas.flatMap((respuesta) => {
      if (respuesta.status === "fulfilled") {
        return respuesta.value;
      }

      console.error("Error en consulta paralela:", respuesta.reason);
      return [];
    });

    const unicos = quitarDuplicados(resultadosTotales);

    const filtrados = unicos.filter((item: any) => {
      const display = normalizarTexto(item.display_name || "");

      const road = normalizarTexto(
        item.address?.road ||
          item.address?.pedestrian ||
          item.address?.footway ||
          item.address?.residential ||
          ""
      );

      const contieneCalle =
        road.includes(calleNormalizada) ||
        display.includes(calleNormalizada);

      const numeroItem = obtenerNumeroDireccion(item);

      // Si el usuario ingresó una altura, se exige que el resultado tenga esa altura real.
      const coincideNumero = !numero || numeroItem === numero;

      return esSaltaCapital(item) && contieneCalle && coincideNumero;
    });

    const resultadosMap = new Map<string, any>();

    for (const item of filtrados) {
      const direccionVisible = formatearDireccionVisible(item, calle);

      const key = normalizarTexto(direccionVisible);

      if (!resultadosMap.has(key)) {
        resultadosMap.set(key, {
          ...item,
          display_name: direccionVisible,
          full_address: item.display_name,
        });
      }
    }

    // Se limita la cantidad de sugerencias para mantener la interfaz clara.
    const resultados = Array.from(resultadosMap.values()).slice(0, 5);

    res.json(resultados);
  } catch (error: any) {
    console.error("ERROR buscarDireccion:", error);
    res.json([]);
  }
};