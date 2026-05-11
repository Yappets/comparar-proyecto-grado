import dotenv from "dotenv";
dotenv.config();

import dns from "dns";
import nodemailer from "nodemailer";

// Fuerza a Node.js a priorizar IPv4.
// En Render, Gmail a veces intenta salir por IPv6 y falla con ENETUNREACH.
dns.setDefaultResultOrder("ipv4first");

// Transportador utilizado para enviar correos desde la cuenta configurada en el .env
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    // Credenciales del correo emisor usadas para recuperación de contraseña
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});