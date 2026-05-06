import { Router } from 'express';
import { signup, login, changePassword } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

import {
  requestPasswordReset,
  resetPassword,
} from "../controllers/passwordResetController";

const router = Router();

// Rutas de autenticación principales.
router.post('/signup', signup);
router.post('/login', login);

// Ruta protegida: requiere token válido para cambiar contraseña desde una sesión activa.
router.post('/change-password', authMiddleware, changePassword);

// Rutas del flujo de recuperación de contraseña.
// request-reset envía el código y link al correo; reset-password actualiza la contraseña.
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;