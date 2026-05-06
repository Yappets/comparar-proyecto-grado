import { Router } from "express";
import {
  agregarDireccion,
  obtenerDirecciones,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Guarda una nueva dirección para el usuario autenticado.
router.post("/direccion", authMiddleware, agregarDireccion);

// Obtiene las direcciones guardadas del usuario autenticado.
router.get("/direcciones", authMiddleware, obtenerDirecciones);

export default router;