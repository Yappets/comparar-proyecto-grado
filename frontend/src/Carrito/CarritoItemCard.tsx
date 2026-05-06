import React from "react";
import { useCart } from "../Carrito/CartContext";
import { calcularTotalConPromocion } from "../Carrito/CalcularPromocion";

type Props = {
  nombre: string;
  imagen: string;
  precioBase: number;
  cantidad: number;
  promocion?: any | null;
  
};

const CarritoItemCard: React.FC<Props> = ({
  nombre,
  imagen,
  precioBase,
  cantidad,
  promocion,
}) => {
  const { updateCantidad, removeFromCart } = useCart();

  // Total dinámico con promo aplicada correctamente
  const subtotal = calcularTotalConPromocion(
    precioBase,
    promocion ?? null,
    cantidad
  );

  const precioUnitario = calcularTotalConPromocion(
    precioBase,
    promocion ?? null,
    1
  );

  return (
    <div className="bg-white rounded-3xl shadow-md p-4 flex flex-col gap-3 w-full max-w-md mx-auto">
      <div className="flex items-center gap-4">

        {/* Imagen */}
        <img
          src={imagen}
          alt={nombre}
          className="w-20 h-20 object-contain"
        />

        {/* Info */}
        <div className="flex-1">
          <p className="text-base font-medium text-black">
            {nombre}
          </p>

          {/* Precio unitario real */}
          <div className="text-sm mt-1">
            <p className="text-gray-800 font-semibold">
              ${precioUnitario.toFixed(2)} x {cantidad}
            </p>

            {/* Subtotal */}
            <p className="text-xs text-gray-600 mt-1">
              Subtotal: ${subtotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              cantidad > 1 &&
              updateCantidad(nombre, cantidad - 1)
            }
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black"
          >
            −
          </button>

          <span className="w-6 text-center">
            {cantidad}
          </span>

          <button
            onClick={() =>
              updateCantidad(nombre, cantidad + 1)
            }
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black"
          >
            +
          </button>

            <button
            onClick={() => removeFromCart(nombre)}
            className="w-8 h-8 !bg-red-500 rounded-lg flex items-center justify-center text-white text-sm font-bold"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarritoItemCard;