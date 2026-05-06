import { Router } from "express";
import {
  reverseGeocode,
  buscarDireccion,
} from "../controllers/geolocalizacion.controller";

const router = Router();

// Obtiene una dirección aproximada a partir de coordenadas.
// Se usa cuando el usuario mueve el pin en el mapa.
router.get("/reverse-geocode", reverseGeocode);

// Busca direcciones escritas por el usuario y devuelve sugerencias.
// Se utiliza para el buscador de direcciones.
router.get("/search", buscarDireccion);

export default router;