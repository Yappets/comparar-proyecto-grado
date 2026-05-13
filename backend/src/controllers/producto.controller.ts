import { Request, Response } from "express";
import Producto from "../models/Producto";

/* ======================================================
   CAMPOS NECESARIOS PARA OPTIMIZAR CONSULTAS
====================================================== */

const CAMPOS_PRODUCTO =
  "titulo precio_base precio_regular oferta_texto imagen supermercado link marca";

/* ======================================================
   PARSEADOR GENERAL DE PROMOCIONES
====================================================== */

const parsearPromocion = (texto: string | null) => {
  if (!texto || texto.trim() === "") return null;

  const limpio = texto.toLowerCase().trim();

  // Detecta promociones del tipo "3x2", "2x1", etc.
  // Se interpreta como N unidades totales, pagando M unidades.
  const matchNxM = limpio.match(/(\d+)\s*x\s*(\d+)/);
  if (matchNxM) {
    const n = parseInt(matchNxM[1]);
    const m = parseInt(matchNxM[2]);

    if (n > m) {
      return {
        tipo: "N_X_M",
        cantidadBloque: n,
        estructura: [
          { unidades: m, descuento: 0 },
          { unidades: n - m, descuento: 100 },
        ],
      };
    }
  }

  // Detecta promociones del tipo "2do al 50%".
  const matchSegundo = limpio.match(/2do.*?(\d+)%/);
  if (matchSegundo) {
    const descuento = parseInt(matchSegundo[1]);

    return {
      tipo: "BLOQUE_DESCUENTO",
      cantidadBloque: 2,
      estructura: [
        { unidades: 1, descuento: 0 },
        { unidades: 1, descuento },
      ],
    };
  }

  // Detecta descuentos unitarios simples, por ejemplo "20%".
  const matchDescuento = limpio.match(/(\d+)%/);
  if (matchDescuento) {
    const descuento = parseInt(matchDescuento[1]);

    return {
      tipo: "DESCUENTO_UNITARIO",
      cantidadBloque: 1,
      estructura: [{ unidades: 1, descuento }],
    };
  }

  return null;
};

/* ======================================================
   FORMATEADOR
====================================================== */

const formatear = (productos: any[]) => {
  return productos.map((p) => {
    // Unifica precios provenientes de distintos supermercados o scrapers.
    const precioBase = parseFloat(
      (p.precio_base ?? p.precio_regular ?? "$0")
        .toString()
        .replace("$", "")
        .replace(/\./g, "")
        .replace(",", ".")
    );

    return {
      titulo: p.titulo,
      precio_base: precioBase,
      promocion: parsearPromocion(p.oferta_texto),
      oferta_texto: p.oferta_texto ?? "No disponible",
      imagen: p.imagen,
      supermercado: p.supermercado || "Desconocido",
      link: p.link,
      marca: p.marca,
    };
  });
};

/* ======================================================
   FUNCIONES DE NORMALIZACIÓN Y MATCH
====================================================== */

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const tokens = (texto: string) =>
  normalizar(texto).split(" ").filter(Boolean);

/* ======================================================
   MARCA
====================================================== */

const marcaBaseEstaContenida = (
  marcaBase: string,
  marcaCandidata: string
): boolean => {
  const base = tokens(marcaBase);
  const candidata = tokens(marcaCandidata);

  if (!base.length || !candidata.length) return false;

  const candidataPegada = candidata.join("");

  // Permite comparar marcas escritas de forma distinta entre supermercados.
  // Ejemplo: "Coca Cola" contra "CocaCola" o variantes similares.
  return base.every((b) =>
    candidata.some((c) => c.includes(b)) ||
    candidataPegada.includes(b)
  );
};

/* ======================================================
   VOLUMEN
====================================================== */

const extraerVolumenMl = (texto: string): number | null => {
  const limpio = normalizar(texto);

  const match = limpio.match(/(\d+(?:[.,]\d+)?)\s*(ml|cc|l|lt)/);

  if (!match) return null;

  let valor = parseFloat(match[1].replace(",", "."));
  const unidad = match[2];

  // Convierte litros a mililitros para comparar productos equivalentes.
  if (unidad === "l" || unidad === "lt") {
    valor *= 1000;
  }

  return valor;
};

const volumenCompatible = (a: string, b: string, tolerancia = 100) => {
  const va = extraerVolumenMl(a);
  const vb = extraerVolumenMl(b);

  // Si no se puede extraer volumen de alguno, no se descarta el producto.
  if (!va || !vb) return true;

  return Math.abs(va - vb) <= tolerancia;
};

/* ======================================================
   PACK
====================================================== */

const extraerPack = (texto: string): number => {
  const limpio = normalizar(texto);

  const match =
    limpio.match(/x\s?(\d+)/) ||
    limpio.match(/(\d+)\s?un/) ||
    limpio.match(/(\d+)\s?u\b/);

  if (!match) return 1;

  return parseInt(match[1]);
};

const packCompatible = (a: string, b: string) => {
  const pa = extraerPack(a);
  const pb = extraerPack(b);

  return pa === pb;
};

/* ======================================================
   GAS
====================================================== */

const detectarGas = (texto: string): "con" | "sin" | null => {
  const t = normalizar(texto);

  if (
    t.includes("sin gas") ||
    t.includes("no gasificada") ||
    t.includes("still")
  )
    return "sin";

  if (
    t.includes("con gas") ||
    t.includes("gasificada") ||
    t.includes("sparkling")
  )
    return "con";

  return null;
};

const gasCompatible = (a: string, b: string) => {
  const ga = detectarGas(a);
  const gb = detectarGas(b);

  // Si no se detecta gasificación en alguno, no se descarta el producto.
  if (!ga || !gb) return true;

  return ga === gb;
};

/* ======================================================
   SIMILITUD
====================================================== */

const similitud = (a: string, b: string) => {
  const pa = tokens(a);
  const pb = tokens(b);

  const comunes = pa.filter((p) => pb.includes(p));

  // Calcula coincidencia entre títulos usando tokens comunes.
  return comunes.length / Math.max(pa.length, pb.length);
};

/* ======================================================
   GET TODOS
====================================================== */

export const getProductos = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const productos = await Producto.find()
      .select(CAMPOS_PRODUCTO)
      .lean();

    const todos = formatear(productos);

    res.status(200).json(todos);
    return;
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
    return;
  }
};

/* ======================================================
   GET PRODUCTO POR NOMBRE
====================================================== */

export const getProductoPorNombre = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nombre = req.params.nombre;
    const nombreDecodificado = decodeURIComponent(nombre);

    const productos = await Producto.find()
      .select(CAMPOS_PRODUCTO)
      .lean();

    const todos = formatear(productos);

    // Se toma como producto base el más parecido al nombre consultado.
    const base = todos
      .map((p) => ({
        ...p,
        score: similitud(p.titulo, nombreDecodificado),
      }))
      .sort((a, b) => b.score - a.score)[0];

    if (!base) {
      res.status(200).json([]);
      return;
    }

    // Filtra productos equivalentes usando marca, volumen, gasificación y pack.
    const candidatos = todos.filter((p) => {
      const marcaBase = base.marca || base.titulo;
      const marcaCand = p.marca || p.titulo;

      if (!marcaBaseEstaContenida(marcaBase, marcaCand)) return false;
      if (!volumenCompatible(base.titulo, p.titulo)) return false;
      if (!gasCompatible(base.titulo, p.titulo)) return false;
      if (!packCompatible(base.titulo, p.titulo)) return false;

      return true;
    });

    // Selecciona el mejor producto equivalente por cada supermercado.
    const mejoresPorSuper = Object.values(
      candidatos.reduce((acc: any, p) => {
        const score = similitud(p.titulo, base.titulo);
        const key = p.supermercado;

        if (!acc[key] || acc[key].score < score) {
          acc[key] = { ...p, score };
        }

        return acc;
      }, {})
    );

    res.status(200).json(mejoresPorSuper);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar producto" });
    return;
  }
};

/* ======================================================
   GET PRODUCTOS AGRUPADOS
====================================================== */

export const getProductosAgrupados = async (
  _req: Request,
  res: Response
) => {
  try {
    const productos = await Producto.find()
      .select(CAMPOS_PRODUCTO)
      .lean();

    const todos = formatear(productos);

    const grupos: Record<string, any[]> = {};

    todos.forEach((p) => {
      // Agrupa productos por título normalizado para evitar repetir productos similares en Home.
      const key = normalizar(p.titulo);

      if (!grupos[key]) {
        grupos[key] = [];
      }

      grupos[key].push(p);
    });

    // Devuelve un representante por grupo para simplificar la visualización inicial.
    const resultado = Object.values(grupos).map((grupo) => grupo[0]);

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos agrupados" });
  }
};