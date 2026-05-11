import dotenv from "dotenv";
dotenv.config();

import dns from "dns";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

// Fuerza a Node.js a priorizar IPv4.
// En Render, Gmail a veces intenta salir por IPv6 y falla con ENETUNREACH.
dns.setDefaultResultOrder("ipv4first");

console.log("MAILER ACTIVO: SMTP Gmail puerto 587 IPv4");

const smtpOptions: SMTPTransport.Options = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    servername: "smtp.gmail.com",
  },

  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
};

// Transportador utilizado para enviar correos desde la cuenta configurada en el .env
export const transporter = nodemailer.createTransport(smtpOptions);