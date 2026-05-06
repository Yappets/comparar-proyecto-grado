import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import productoRoutes from "./routes/producto.routes";
import authRoutes from "./routes/auth.routes";
import { connectDB } from "./config/db";

import geolocalizacionRoutes from "./routes/geolocalizacion.routes";
import userRoutes from "./routes/user.routes";
import supermercadoRoutes from "./routes/supermercado.routes";

// Carga variables de entorno como PORT, MONGO_URI, FRONT_URL y credenciales de correo.
dotenv.config();

const app = express();

// Inicializa una única conexión a MongoDB antes de registrar las rutas.
connectDB();

// Middlewares globales de la API.
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());

// Ruta base para verificar rápidamente que la API está activa.
app.get("/", (_req, res) => {
  res.send("API funcionando correctamente");
});

// Rutas principales de la aplicación.
app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api", geolocalizacionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/supermercados", supermercadoRoutes);

// Inicio del servidor.
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});