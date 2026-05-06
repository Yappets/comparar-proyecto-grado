import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

// Transportador utilizado para enviar correos desde la cuenta configurada en el .env
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // Credenciales del correo emisor usadas para funcionalidades como recuperación de contraseña
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});