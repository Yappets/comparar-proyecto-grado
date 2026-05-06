import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { calcularTotalConPromocion } from "../Carrito/CalcularPromocion";
import { ExternalLink } from "lucide-react";
import { API_URL } from "../config/api";

type Props = {
  supermercado: string | null;
};

type ProductoDetalle = {
  nombre: string;
  titulo: string;
  supermercado: string;
  imagen: string;
  precio_base: number;
  oferta_texto: string;
  promocion: any | null;
  link: string;
};

const Checkout: React.FC<Props> = ({ supermercado }) => {
  const { items } = useCart();

  const [disponibilidad, setDisponibilidad] = useState<any[]>([]);

  // 🔥 MISMA LÓGICA QUE DETALLE
  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        const resultados = await Promise.all(
          items.map(async (item) => {
            const res = await fetch(`${API_URL}/api/productos/detalle/${encodeURIComponent(item.nombre)}`);
            const data = await res.json();

            return {
              nombre: item.nombre,
              cantidad: item.cantidad,
              opciones: data, // EXACTAMENTE igual que detalle
            };
          })
        );

        setDisponibilidad(resultados);
      } catch (error) {
        console.error("Error cargando checkout", error);
      }
    };

    if (items.length > 0) {
      fetchDisponibilidad();
    }
  }, [items]);

  // SOLO PRODUCTOS DEL SUPER SELECCIONADO
  const productosFinal = disponibilidad.map((item) => {
    const encontrado = item.opciones.find(
      (p: ProductoDetalle) => p.supermercado === supermercado
    );

    return {
      ...item,
      imagen: encontrado?.imagen,
      link: encontrado?.link || null,
      precioFinal: encontrado
        ? calcularTotalConPromocion(
            encontrado.precio_base,
            encontrado.promocion,
            item.cantidad
          )
        : null,
    };
  });

  return (
    <div className="space-y-4 pb-32">
      
      {/* HEADER */}
      <h2 className="text-center font-semibold text-lg">
        Comprando en {supermercado || "Supermercado"}
      </h2>

      <p className="text-center text-sm text-gray-500">
        Tocá un producto para comprarlo en el supermercado
      </p>

     {/* LISTA */}
      {productosFinal.map((prod) => (
        <div
          key={prod.nombre}
          className="bg-white rounded-2xl shadow p-4 flex items-center gap-4"
        >
          {/* Imagen */}
          {prod.link ? (
            <img
              src={prod.imagen}
              alt={prod.nombre}
              className="w-16 h-16 object-contain"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
              <span className="text-xs text-gray-400">N/A</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <p className="font-medium text-black">
              {prod.nombre}
            </p>

            <p className="text-sm text-gray-600">
              {prod.cantidad} unidad(es)
            </p>

            {prod.precioFinal !== null && (
              <p className="text-sm font-semibold">
                ${prod.precioFinal.toFixed(2)}
              </p>
            )}
          </div>

          {/* BOTÓN */}
          {prod.link ? (
           <button
            onClick={() => window.open(prod.link, "_blank")}
            className="flex items-center gap-1 !bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-semibold"
          >
            Ver
            <ExternalLink size={14} />
          </button>
          ) : (
            <span className="text-red-500 text-xs">
              No disponible
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Checkout;