import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';

// Clave utilizada para firmar los JWT. En producción debe venir desde variables de entorno.
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const signup: RequestHandler = async (req, res) => {
  try {
    const { email, password, acceptedTerms } = req.body;

    // El registro solo se permite si el usuario acepta los términos y condiciones.
    if (!acceptedTerms) {
      res.status(400).json({ error: 'Debes aceptar los términos.' });
      return;
    }

    // Evita registrar dos usuarios con el mismo correo electrónico.
    const existing = await UserModel.findOne({ email });
    if (existing) {
      res.status(409).json({ error: 'El email ya está en uso.' });
      return;
    }

    // La contraseña se almacena encriptada, nunca en texto plano.
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new UserModel({ email, passwordHash, acceptedTerms });
    await user.save();

    // Se genera un token para mantener la sesión del usuario luego del registro.
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token });
    return;
  } catch (err) {
    console.error('[signup] Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // Compara la contraseña ingresada con el hash almacenado.
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(400).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // Si las credenciales son correctas, se devuelve un JWT válido por 1 día.
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
    return;
  } catch (err) {
    console.error('[login] Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const changePassword: RequestHandler = async (req: any, res) => {
  try {
    // El userId proviene del middleware de autenticación.
    const userId = req.userId as string;
    const { currentPassword, newPassword } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }

    // Antes de cambiar la contraseña se valida la contraseña actual.
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      res.status(400).json({ error: 'Contraseña actual incorrecta.' });
      return;
    }

    // La nueva contraseña también se guarda como hash.
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Contraseña actualizada con éxito.' });
    return;
  } catch (err) {
    console.error('[changePassword] Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};