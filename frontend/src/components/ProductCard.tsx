import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Carrito/CartContext";

type Promocion = {
  tipo: "N_X_M" | "BLOQUE_DESCUENTO" | "DESCUENTO_UNITARIO";
  cantidadBloque: number;
  estructura: {
    unidades: number;
    descuento: number;
  }[];
};

type ProductCardProps = {
  titulo: string;
  precio_base: number;
  promocion: Promocion | null;
  oferta_texto: string;
  imagen: string;
  link: string;
  supermercado: string;
};

const calcularPrecioUnitario = (
  precioBase: number,
  promo: Promocion | null
): number => {
  if (!promo) return precioBase;

  // DESCUENTO SIMPLE
  if (promo.tipo === "DESCUENTO_UNITARIO") {
    const descuento = promo.estructura[0].descuento;
    return precioBase * (1 - descuento / 100);
  }

  // 2DO AL 50%
  if (promo.tipo === "BLOQUE_DESCUENTO") {
    const precio1 = precioBase;
    const precio2 =
      precioBase * (1 - promo.estructura[1].descuento / 100);
    return (precio1 + precio2) / 2;
  }

  // N x M (ej 6x5)
  if (promo.tipo === "N_X_M") {
    const pagadas = promo.estructura[0].unidades;
    const gratis = promo.estructura[1].unidades;
    const total = pagadas + gratis;
    return (precioBase * pagadas) / total;
  }

  return precioBase;
};

const ProductCard: React.FC<ProductCardProps> = ({
  titulo,
  precio_base,
  promocion,
  oferta_texto,
  imagen,
  link,
  supermercado,
}) => {
  const navigate = useNavigate();
  const { addToCart, setSupermercadoSeleccionado } = useCart();

  const handleClick = () => {
    navigate(`/producto/${encodeURIComponent(titulo)}`);
  };

  const precioFinal = calcularPrecioUnitario(
    precio_base,
    promocion
  );

  const tienePromo = promocion !== null;

  const handleAgregar = (e: React.MouseEvent) => {
    e.stopPropagation();

    console.log("AGREGANDO PRODUCTO:", {
      titulo,
    });

    setSupermercadoSeleccionado(supermercado);

    addToCart({
      nombre: titulo,
      precioBase: precio_base,
      imagen,
      cantidad: 1,
      promocion,
      link,
      supermercado,
    });
  };

  const getColor = (sup: string) => {
    if (sup === "Super Vea") return "bg-green-500";
    if (sup === "Super Jumbo") return "bg-blue-500";
    return "bg-red-500";
  };

  return (
    <div
      onClick={handleClick}
      className="
        bg-white rounded-3xl shadow-md 
        flex flex-col 
        p-5 
        cursor-pointer
        transition hover:shadow-xl
        md:h-[440px]
      "
    >
      {/* ================= BADGE ZONE ================= */}
      <div className="h-[32px] mb-2 flex items-center justify-center">
        {tienePromo && (
          <div
            className={`inline-flex items-center px-4 py-1 rounded-full text-white text-xs font-semibold ${getColor(
              supermercado
            )}`}
          >
            🔥 Ver promociones
          </div>
        )}
      </div>

      {/* ================= IMAGE ZONE ================= */}
      <div className="h-[160px] flex items-center justify-center">
        <img
          src={imagen}
          alt={titulo}
          loading="lazy"
          decoding="async"
          className="max-h-[150px] object-contain"
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex flex-col flex-1 mt-3">

        {/* ===== TITULO (altura fija) ===== */}
        <div className="h-[64px]">
          <p className="text-lg font-medium text-gray-800 text-center line-clamp-2">
            {titulo}
          </p>
        </div>

        {/* ===== PRECIO (altura fija) ===== */}
        <div className="h-[60px] flex flex-col justify-center text-center">
          {!tienePromo && (
            <p className="text-sm text-gray-400">
              ${precio_base.toFixed(2)}
            </p>
          )}

          <p className="text-sm text-gray-500">Desde</p>
          <p className="text-lg font-semibold text-gray-800">
            ${precioFinal.toFixed(2)}
          </p>
        </div>

        {/* ===== BOTÓN ===== */}
        <div className="mt-auto pt-4 flex justify-center">
          <button
            onClick={handleAgregar}
            className="
              px-6 py-2 
              text-white text-sm font-semibold 
              rounded-full shadow-md
              !bg-red-600 hover:bg-[#2b1f1c]
              transition
            "
          >
            Agregar
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;