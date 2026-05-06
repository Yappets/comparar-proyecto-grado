import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  titulo: String,
  precio_base: Number,

  // Campos de precio provenientes del scraping.
  // Se conservan ambos porque algunos supermercados diferencian precio regular y precio de oferta.
  precio_regular: String,
  precio_oferta: String,

  imagen: String,
  oferta_texto: String,
  link: String,

  // Identifica de qué supermercado proviene el producto.
  supermercado: String,

  // Fecha en la que se obtuvo o actualizó el producto mediante scraping.
  fecha_scraping: Date,

  // Campos auxiliares usados para normalización, agrupación y comparación entre supermercados.
  producto_key: String,
  marca: String,
  tipo: String,
  volumen: Number,
});

export default mongoose.model("Producto", productoSchema);