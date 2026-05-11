import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model";
import { transporter } from "../config/mailer";

/* ======================================================
   1. SOLICITAR RESET (envía mail si el usuario existe)
====================================================== */
export const requestPasswordReset = async (req: Request, res: Response) => {
  const email = String(req.body.email || "").trim();

  const respuestaGenerica = {
    message: "Si el email existe, se envió un link de recuperación",
  };

  try {
    // Se responde siempre igual para no revelar si un correo está registrado o no.
    if (!email) {
      res.json(respuestaGenerica);
      return;
    }

    const user = await UserModel.findOne({ email });

    // Si el usuario no existe, no se envía correo, pero se responde igual.
    if (!user) {
      res.json(respuestaGenerica);
      return;
    }

    // Token para identificar la solicitud y código corto que el usuario debe ingresar.
    const token = crypto.randomBytes(32).toString("hex");
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // La solicitud de recuperación expira a los 15 minutos por seguridad.
    user.resetToken = token;
    user.resetCode = code;
    user.resetExp = new Date(Date.now() + 1000 * 60 * 15);

    await user.save();

    const FRONT_URL = process.env.FRONT_URL || "http://localhost:5173";
    const resetLink = `${FRONT_URL}/reset-password?token=${token}`;

    // Envío del link y código de recuperación al correo registrado.
    await transporter.sendMail({
      to: user.email,
      subject: "Recuperar contraseña",
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Usá este código:</p>
        <h1>${code}</h1>
        <p>Ingresá al siguiente link:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Expira en 15 minutos</p>
      `,
    });

    res.json(respuestaGenerica);

  } catch (error) {
    console.error("Error en requestPasswordReset:", error);
    res.status(500).json({ error: "Error servidor" });
  }
};

/* ======================================================
   2. VALIDAR CÓDIGO (opcional, por si querés usarlo)
====================================================== */
export const validateResetCode = async (req: Request, res: Response) => {
  const { token, code } = req.body;

  try {
    const user = await UserModel.findOne({ resetToken: token });

    if (!user) {
      res.status(400).json({ error: "Token inválido" });
      return;
    }

    if (!user.resetExp || user.resetExp < new Date()) {
      res.status(400).json({ error: "Token expirado" });
      return;
    }

    // Valida que el código ingresado coincida con el enviado por correo.
    if (user.resetCode !== code) {
      res.status(400).json({ error: "Código incorrecto" });
      return;
    }

    res.json({ valid: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
};

/* ======================================================
   3. CAMBIAR PASSWORD
====================================================== */
export const resetPassword = async (req: Request, res: Response) => {
  const { token, code, password } = req.body;

  try {
    // Validación previa para evitar errores al generar el hash de la nueva contraseña.
    if (!token || !code || !password) {
      res.status(400).json({ error: "Faltan datos" });
      return;
    }

    const user = await UserModel.findOne({ resetToken: token });

    if (!user) {
      res.status(400).json({ error: "Token inválido" });
      return;
    }

    if (!user.resetExp || user.resetExp < new Date()) {
      res.status(400).json({ error: "Token expirado" });
      return;
    }

    if (user.resetCode !== code) {
      res.status(400).json({ error: "Código incorrecto" });
      return;
    }

    // La nueva contraseña se almacena encriptada, nunca en texto plano.
    const hash = await bcrypt.hash(password, 10);

    user.passwordHash = hash;

    // Se limpian los datos temporales para impedir reutilizar el mismo link/código.
    user.resetToken = undefined;
    user.resetCode = undefined;
    user.resetExp = undefined;

    await user.save();

    res.json({ message: "Contraseña actualizada" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
};