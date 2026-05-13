import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import BottomNav from "../../components/BottomNav2";

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
  loadingProductos: boolean;
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
  loadingProductos,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER MOBILE */}
      <header className="bg-white border-b sticky top-0 z-20 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="!bg-transparent p-0 border-none shadow-none text-black"
        >
          <ArrowLeft size={20} />
        </button>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="flex-1 px-3 py-2 border rounded-full text-sm bg-white text-black"
        />
      </header>

      {/* CONTENIDO */}
      <main className="px-4 py-4 pb-24">

        {/* TITULO + FILTRO */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold">
            {soloOfertas ? "Ofertas destacadas" : "Todos los productos"}
          </h2>

          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-600">
              {loadingProductos
                ? "Cargando..."
                : `${totalProducts} ${soloOfertas ? "ofertas" : "productos"}`}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700">
                {soloOfertas ? "Ofertas" : "Todos"}
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
        {loadingProductos ? (
          <div className="space-y-4">
            <p className="text-center text-gray-500">
              Cargando productos...
            </p>

            <div className="animate-pulse space-y-4">
              <div className="h-40 bg-gray-200 rounded-3xl"></div>
              <div className="h-40 bg-gray-200 rounded-3xl"></div>
              <div className="h-40 bg-gray-200 rounded-3xl"></div>
            </div>
          </div>
        ) : productos.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            {search.trim()
              ? soloOfertas
                ? "No se encontraron ofertas para ese producto."
                : "Producto no disponible."
              : soloOfertas
                ? "No hay ofertas disponibles."
                : "No hay productos disponibles."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {productos.map((prod, i) => (
              <ProductCard
                key={prod.producto_key || `${prod.titulo}-${prod.supermercado}-${i}`}
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
        )}

        {/* PAGINACIÓN */}
        {!loadingProductos && totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        )}
      </main>

      {/* ================= BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <BottomNav />
      </div>
    </div>
  );
};

export default CategoriasBebidasMobile;