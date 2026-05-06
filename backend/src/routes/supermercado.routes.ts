import { Router } from "express";
import {
  getSupermercados,
  getDistancias,
} from "../controllers/supermercado.controller";

const router = Router();

// Devuelve el listado de supermercados y sus sucursales registradas.
router.get("/", getSupermercados);

// Calcula la sucursal más cercana de cada supermercado según la ubicación del usuario.
router.get("/distancias", getDistancias);

export default router;