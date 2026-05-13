import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../../Carrito/CartContext";
import ResumenCompra from "../../Carrito/ResumenCompra";
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

const DetalleProductoDesktop = () => {
  const {
    addToCart,
    setSupermercadoSeleccionado,
    cartCount,
  } = useCart();

  const navigate = useNavigate();
  const { nombre } = useParams<{ nombre: string }>();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProducto, setLoadingProducto] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!nombre) {
      setLoadingProducto(false);
      return;
    }

    setLoadingProducto(true);

    fetch(`${API_URL}/api/productos/detalle/${encodeURIComponent(nombre)}`)
      .then((res) => res.json())
      .then((data: Producto[]) => {
        setProductos(Array.isArray(data) ? data : []);
      })
      .catch((err) =>
        console.error("Error al cargar producto", err)
      )
      .finally(() => {
        setLoadingProducto(false);
      });
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
    <div className="min-h-screen bg-gray-50 relative">

      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="!bg-transparent p-0 border-none shadow-none text-black"
            >
              <ArrowLeft size={24} />
            </button>

            <h1 className="text-xl font-semibold truncate">
              {loadingProducto ? "Cargando producto..." : titulo}
            </h1>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-14 h-14 rounded-full !bg-red-600 hover:bg-[#d82b37] flex items-center justify-center shadow-md transition shrink-0"
          >
            <img
              src="/icons/icono_carrito.png"
              alt="Carrito"
              className="h-7 w-auto object-contain"
            />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 !bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* CARGANDO */}
      {loadingProducto ? (
        <div className="max-w-5xl mx-auto p-6">
          <p className="text-center text-gray-500 mb-6">
            Cargando producto...
          </p>

          <div className="animate-pulse space-y-6">
            <div className="mx-auto h-[220px] w-[260px] bg-gray-200 rounded-2xl"></div>

            <div className="bg-white rounded-2xl shadow p-6">
              <div className="h-6 bg-gray-200 rounded-xl w-1/2 mx-auto mb-6"></div>

              <div className="space-y-4">
                <div className="h-16 bg-gray-200 rounded-xl"></div>
                <div className="h-16 bg-gray-200 rounded-xl"></div>
                <div className="h-16 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      ) : productos.length === 0 ? (
        <div className="max-w-5xl mx-auto p-6">
          <p className="text-center text-gray-500">
            No se encontró información del producto.
          </p>
        </div>
      ) : (
        <>
          {/* CONTENIDO */}
          <div className="max-w-5xl mx-auto p-6 pb-28">

            {/* IMAGEN */}
            <div className="flex justify-center mb-6">
              <img
                src={imagenPrincipal}
                alt={titulo}
                className="max-h-[250px] object-contain"
              />
            </div>

            {/* CARD */}
            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-center text-lg font-bold mb-6">
                {titulo}
              </h2>

              <div className="space-y-4">

                {visibles.map((p, idx) => {
                  const precioBase = p.precio_base ?? 0;

                  const precioFinal = calcularPrecioUnitario(
                    precioBase,
                    p.promocion
                  );

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3"
                    >
                      {/* LOGO */}
                      <div className="w-[20%]">
                        <img
                          src={`/icons/${p.supermercado
                            .toLowerCase()
                            .replace(" ", "")}.png`}
                          alt={p.supermercado}
                          className="w-10 h-10 object-contain"
                        />
                      </div>

                      {/* PROMO */}
                      <div className="w-[40%] text-center text-sm">
                        {p.oferta_texto?.toLowerCase() !==
                        "no disponible"
                          ? p.oferta_texto
                          : "Sin oferta"}
                      </div>

                      {/* PRECIO */}
                      <div className="w-[40%] text-right">
                        {p.promocion && (
                          <div className="text-xs text-gray-400 line-through">
                            ${precioBase.toFixed(0)}
                          </div>
                        )}

                        <div className="text-lg font-semibold">
                          ${precioFinal.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg z-20">
            <div className="max-w-5xl mx-auto flex justify-center">
              <button
                onClick={handleAgregar}
                className="!bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d82b37]"
              >
                Agregar
              </button>
            </div>
          </div>
        </>
      )}

      {/* DRAWER */}
      <>
        {isCartOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30"
            onClick={() => setIsCartOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-40 transform transition-transform duration-300 ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <ResumenCompra
            isDrawer
            onClose={() => setIsCartOpen(false)}
          />
        </div>
      </>
    </div>
  );
};

export default DetalleProductoDesktop;