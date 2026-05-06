import { Request, Response } from "express";
import { Supermercado } from "../models/supermercado.model";

/* ======================================================
   DISTANCIA (HAVERSINE)
====================================================== */

const calcularDistancia = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  // Fórmula de Haversine para calcular la distancia entre dos coordenadas geográficas.
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/* ======================================================
   GET SUPERMERCADOS
====================================================== */

export const getSupermercados = async (_req: Request, res: Response) => {
  try {
    const supermercados = await Supermercado.find();

    res.json(supermercados);
  } catch (error) {
    console.error("Error obteniendo supermercados:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

/* ======================================================
   GET DISTANCIAS
====================================================== */

export const getDistancias = async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ error: "Faltan coordenadas" });
      return;
    }

    const userLat = parseFloat(lat as string);
    const userLon = parseFloat(lon as string);

    const supermercados = await Supermercado.find();

    // Agrupa las sucursales por cadena para comparar solo la más cercana de cada supermercado.
    const agrupados: Record<string, any[]> = {};

    supermercados.forEach((s: any) => {
      let key = "";

      if (s.nombre.toLowerCase().includes("jumbo")) key = "Jumbo";
      else if (s.nombre.toLowerCase().includes("vea")) key = "Vea";
      else if (s.nombre.toLowerCase().includes("dia")) key = "Dia";

      if (!key) return;

      if (!agrupados[key]) agrupados[key] = [];
      agrupados[key].push(s);
    });

    const resultado: any[] = [];

    for (const nombre in agrupados) {
      const sucursales = agrupados[nombre];

      let masCercano: any = null;
      let minDist = Infinity;

      // Calcula la distancia de cada sucursal y conserva la más cercana al usuario.
      sucursales.forEach((suc: any) => {
        const distancia = calcularDistancia(
          userLat,
          userLon,
          suc.lat,
          suc.lon
        );

        if (distancia < minDist) {
          minDist = distancia;
          masCercano = suc;
        }
      });

      if (masCercano) {
        resultado.push({
          nombre,
          sucursal: masCercano.direccion,
          distancia: minDist,
        });
      }
    }

    res.json(resultado);
  } catch (error) {
    console.error("Error calculando distancias:", error);
    res.status(500).json({ error: "Error interno" });
  }
};