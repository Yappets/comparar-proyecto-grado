import { RequestHandler } from "express";
import { UserModel } from "../models/user.model";

export const agregarDireccion: RequestHandler = async (req: any, res) => {
  try {
    // El userId es agregado previamente por el middleware de autenticación.
    const userId = req.userId;
    const { direccion, lat, lon } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // Guarda la dirección seleccionada junto con sus coordenadas para reutilizarla en la app.
    user.direcciones.push({
      direccion,
      lat,
      lon,
      createdAt: new Date(),
    });

    await user.save();

    res.json({ message: "Dirección guardada correctamente" });
  } catch (error) {
    console.error("Error guardar dirección:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const obtenerDirecciones: RequestHandler = async (req: any, res) => {
  try {
    // Se recuperan solo las direcciones del usuario autenticado.
    const userId = req.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json(user.direcciones);
  } catch (error) {
    console.error("Error obtener direcciones:", error);
    res.status(500).json({ error: "Error interno" });
  }
};