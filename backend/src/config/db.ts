import mongoose from "mongoose";
import dotenv from "dotenv";

// Carga las variables de entorno definidas en el archivo .env
dotenv.config();

export const connectDB = async () => {
  try {
    // Conexión única a MongoDB usando la URI configurada en el entorno
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "supermercados_db",
    });

    console.log("Mongo conectado");
  } catch (error) {
    console.error(error);

    // Si falla la conexión, se detiene el servidor para evitar que la API funcione sin base de datos
    process.exit(1);
  }
};