import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

// Clave utilizada para validar los JWT recibidos en las peticiones protegidas.
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica el token y extrae el id del usuario autenticado.
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };

    // Se adjunta el userId al request para que los controladores puedan identificar al usuario.
    (req as any).userId = payload.id;

    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};