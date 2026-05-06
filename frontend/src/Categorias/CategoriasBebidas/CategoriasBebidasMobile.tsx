import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import ResumenCompra from "../../Carrito/ResumenCompra";
import { useCart } from "../../Carrito/CartContext";
import { Home } from "lucide-react";

type ProductoApi = {
  titulo: string;
  precio_base: number;
  promocion: any | null;
  oferta_texto: string;
  imagen: string;
  supermercado: string;
  link: string;
  producto_key: string;
};

type Props = {
  productos: ProductoApi[];
  totalProducts: number;
  page: number;
  totalPages: number;
  setPage: (n: number) => void;
  soloOfertas: boolean;
  setSoloOfertas: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: (v: string) => void;
};

const CategoriasBebidasMobile: React.FC<Props> = ({
  productos,
  totalProducts,
  page,
  totalPages,
  setPage,
  soloOfertas,
  setSoloOfertas,
  search,
  setSearch,
}) => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER MOBILE */}
      <header className="bg-white border-b sticky top-0 z-20 px-4 py-3 flex items-center gap-3">

        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="flex-1 px-3 py-2 border rounded-full text-sm"
        />

       <button
          onClick={() => navigate("/resumen")}
          className="relative flex items-center justify-center !bg-red-600"
        >
          <img
            src="/icons/icono_carrito.png"
            alt="Carrito"
            className="w-6 h-6 object-contain"
          />

          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] px-1 rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* CONTENIDO */}
      <main className="px-4 py-4">

        {/* TITULO + FILTRO */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold">
            {soloOfertas ? "Ofertas destacadas" : "Todos los productos"}
          </h2>

          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-600">
              {totalProducts} productos
            </span>

            <div className="flex items-center gap-2">

              <span className="text-xs text-gray-700">
                Ofertas
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={soloOfertas}
                  onChange={() =>
                    setSoloOfertas((prev) => !prev)
                  }
                  className="sr-only peer"
                />

                {/* Fondo */}
                <div className="w-10 h-5 bg-gray-400 rounded-full peer-checked:bg-gray-500 transition" />

                {/* Círculo */}
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition peer-checked:translate-x-5" />
              </label>

            </div>
          </div>
        </div>

        {/* GRID MOBILE */}
        <div className="grid grid-cols-1 gap-4">
          {productos.map((prod) => (
            <ProductCard
              key={prod.producto_key}
              titulo={prod.titulo}
              precio_base={prod.precio_base}
              promocion={prod.promocion}
              oferta_texto={prod.oferta_texto}
              imagen={prod.imagen}
              link={prod.link}
              supermercado={prod.supermercado}
            />
          ))}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        )}
      </main>

      {/* DRAWER */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-30"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed bottom-0 left-0 w-full h-[80%] bg-white rounded-t-3xl z-40">
            <ResumenCompra
              isDrawer
              onClose={() => setIsCartOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriasBebidasMobile;