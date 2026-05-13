import express from "express";
import {
  getProductos,
  getProductoPorNombre,
  getProductosAgrupados,
  getProductosPorNombres,
} from "../controllers/producto.controller";

const router = express.Router();

// Devuelve todos los productos almacenados.
router.get("/", getProductos);

// Devuelve productos agrupados para evitar repeticiones en la pantalla de inicio.
router.get("/home", getProductosAgrupados);

// Devuelve el detalle comparativo de varios productos según sus nombres.
router.post("/detalles", getProductosPorNombres);

// Devuelve el detalle comparativo de un producto según su nombre.
router.get("/detalle/:nombre", getProductoPorNombre);

export default router;