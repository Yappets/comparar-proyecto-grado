import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../../Carrito/CartContext";
import { API_URL } from "../../config/api";

/* ================= TIPOS ================= */

type Promocion = {
  tipo: "N_X_M" | "BLOQUE_DESCUENTO" | "DESCUENTO_UNITARIO";
  cantidadBloque: number;
  estructura: {
    unidades: number;
    descuento: number;
  }[];
};

type Producto = {
  nombre: string;
  titulo: string;
  supermercado: string;
  imagen: string;
  precioMin: number | null;
  precioMax: number | null;
  precio_base: number;
  oferta_texto: string;
  imagenPrincipal: string;
  promocion: Promocion | null;
  link: string;
};

/* ================= CALCULO PROMO ================= */

const calcularPrecioUnitario = (
  precioBase: number,
  promo: Promocion | null
): number => {
  if (!promo) return precioBase;

  if (promo.tipo === "DESCUENTO_UNITARIO") {
    const descuento = promo.estructura[0].descuento;
    return precioBase * (1 - descuento / 100);
  }

  if (promo.tipo === "BLOQUE_DESCUENTO") {
    const precio1 = precioBase;
    const precio2 =
      precioBase * (1 - promo.estructura[1].descuento / 100);
    return (precio1 + precio2) / 2;
  }

  if (promo.tipo === "N_X_M") {
    const pagadas = promo.estructura[0].unidades;
    const gratis = promo.estructura[1].unidades;
    const total = pagadas + gratis;
    return (precioBase * pagadas) / total;
  }

  return precioBase;
};

/* ================= COMPONENTE ================= */

const DetalleProductoMobile = () => {
  const { addToCart, setSupermercadoSeleccionado } = useCart();
  const navigate = useNavigate();
  const { nombre } = useParams<{ nombre: string }>();

  const [productos, setProductos] = useState<Producto[]>([]);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!nombre) return;

    fetch(`${API_URL}/api/productos/detalle/${encodeURIComponent(nombre)}`)
      .then((res) => res.json())
      .then((data: Producto[]) => setProductos(data))
      .catch((err) =>
        console.error("Error al cargar producto", err)
      );
  }, [nombre]);

  /* ================= DATA ================= */

  const visibles = productos.filter(
    (p) => p.precioMin !== null || p.precioMax !== null
  );

  const imagenPrincipal =
    productos.find((p) => p.imagen)?.imagen ||
    "/icons/placeholder.png";

  const titulo = productos[0]?.nombre ?? nombre;

  const productoMasBarato = visibles
    .map((p) => {
      const precio = calcularPrecioUnitario(
        p.precio_base ?? 0,
        p.promocion
      );

      return { ...p, precioCalculado: precio };
    })
    .sort((a, b) => a.precioCalculado - b.precioCalculado)[0];

  /* ================= ACTION ================= */

  const handleAgregar = () => {
    if (!productoMasBarato) return;

    setSupermercadoSeleccionado(productoMasBarato.supermercado);

    addToCart({
      nombre:
        productoMasBarato.nombre ||
        productoMasBarato.titulo,
      precioBase: productoMasBarato.precio_base,
      imagen: productoMasBarato.imagen,
      cantidad: 1,
      promocion: productoMasBarato.promocion,
      link: "",
      supermercado: productoMasBarato.supermercado,
    });
  };

  /* ================= RENDER ================= */

  return (
    <div className="flex flex-col h-[100dvh] bg-white">

      {/* HEADER */}
      <div className="px-4 py-4 bg-white shadow-sm sticky top-0 z-20">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-black mt-1"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="text-lg font-semibold leading-tight break-words">
            {titulo}
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 overflow-y-auto">

        {/* IMAGEN */}
        <div className="flex justify-center items-center py-6 px-4">
          <img
            src={imagenPrincipal}
            alt={titulo}
            className="max-h-[180px] object-contain"
          />
        </div>

        {/* LISTA */}
        <div className="px-4 pb-32">
          <div className="bg-white rounded-3xl shadow-md p-4">

            <p className="text-center font-bold text-lg mb-4">
              {titulo}
            </p>

            <div className="space-y-3">

              {visibles.map((p, idx) => {
                const precioBase = p.precio_base ?? 0;

                const precioFinal = calcularPrecioUnitario(
                  precioBase,
                  p.promocion
                );

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 rounded-full px-4 py-3"
                  >
                    {/* LOGO */}
                    <div className="w-[25%] flex items-center">
                      <img
                        src={`/icons/${p.supermercado
                          .toLowerCase()
                          .replace(" ", "")}.png`}
                        alt={p.supermercado}
                        className="w-8 h-8 object-contain"
                      />
                    </div>

                    {/* PROMO */}
                    <div className="w-[45%] text-center">
                      {p.oferta_texto?.toLowerCase() !==
                      "no disponible" ? (
                        <span className="text-gray-700 text-sm">
                          {p.oferta_texto}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Sin oferta
                        </span>
                      )}
                    </div>

                    {/* PRECIO */}
                    <div className="w-[30%] text-right">
                      {p.promocion && (
                        <div className="text-xs text-gray-400 line-through">
                          ${precioBase.toFixed(0)}
                        </div>
                      )}

                      <div className="text-black font-semibold text-lg">
                        ${precioFinal.toFixed(0)}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-white px-4 pb-6 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-30">
        <button
          onClick={handleAgregar}
          className="w-full py-3 text-white font-semibold rounded-full !bg-red-600 hover:bg-[#2b1f1c]"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default DetalleProductoMobile;