import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDireccion {
  direccion: string;
  lat: number;
  lon: number;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  acceptedTerms: boolean;

  // Direcciones guardadas por el usuario para reutilizarlas dentro de la app.
  direcciones: IDireccion[];

  createdAt: Date;
  updatedAt: Date;

  // Campos temporales usados en el flujo de recuperación de contraseña.
  resetToken?: string;
  resetCode?: string;
  resetExp?: Date;
}

const DireccionSchema = new Schema<IDireccion>({
  direccion: { type: String, required: true },

  // Coordenadas asociadas a la dirección seleccionada.
  lat: { type: Number },
  lon: { type: Number },

  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // La contraseña se guarda como hash, no como texto plano.
    passwordHash: {
      type: String,
      required: true,
    },

    acceptedTerms: {
      type: Boolean,
      required: true,
      default: false,
    },

    direcciones: {
      type: [DireccionSchema],
      default: [],
    },

    // Datos temporales para restablecer contraseña mediante link + código.
    resetToken: {
      type: String,
    },
    resetCode: {
      type: String,
    },
    resetExp: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Usa el modelo existente si ya fue registrado por Mongoose.
// Esto evita errores al recargar el servidor en desarrollo.
export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);