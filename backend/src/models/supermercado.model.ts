import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISupermercado extends Document {
  nombre: string;
  direccion: string;
  lat: number;
  lon: number;
}

const SupermercadoSchema = new Schema<ISupermercado>({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },

  // Coordenadas de cada sucursal, usadas para calcular distancia con la ubicación del usuario.
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
});

// Usa el modelo existente si ya fue registrado por Mongoose.
// Esto evita errores al recargar el servidor en desarrollo.
export const Supermercado: Model<ISupermercado> =
  (mongoose.models.Supermercado as Model<ISupermercado>) ||
  mongoose.model<ISupermercado>("Supermercado", SupermercadoSchema);