// src/utils/calcularPromocion.ts

export const calcularTotalConPromocion = (
  precioBase: number,
  promocion: any | null,
  cantidad: number
) => {
  if (!promocion || cantidad === 0) {
    return precioBase * cantidad;
  }

  // =========================
  // DESCUENTO UNITARIO (-15%)
  // =========================
  if (promocion.tipo === "DESCUENTO_UNITARIO") {
    const descuento = promocion.estructura[0].descuento;
    const precioConDesc = precioBase * (1 - descuento / 100);
    return precioConDesc * cantidad;
  }

  // =========================
  // 2DO AL 50%, 70%, etc
  // =========================
  if (promocion.tipo === "BLOQUE_DESCUENTO") {
    const bloque = promocion.cantidadBloque; // 2
    const descuento = promocion.estructura[1].descuento;

    const bloquesCompletos = Math.floor(cantidad / bloque);
    const resto = cantidad % bloque;

    const precioSegundo =
      precioBase * (1 - descuento / 100);

    const totalBloques =
      bloquesCompletos * (precioBase + precioSegundo);

    const totalRestante = resto * precioBase;

    return totalBloques + totalRestante;
  }

  // =========================
  // N x M (6x5, 3x2, etc)
  // =========================
  if (promocion.tipo === "N_X_M") {
    const bloque = promocion.cantidadBloque;
    const pagadas = promocion.estructura[0].unidades;

    const bloquesCompletos = Math.floor(cantidad / bloque);
    const resto = cantidad % bloque;

    const totalBloques =
      bloquesCompletos * (pagadas * precioBase);

    const totalRestante = resto * precioBase;

    return totalBloques + totalRestante;
  }

  return precioBase * cantidad;
};