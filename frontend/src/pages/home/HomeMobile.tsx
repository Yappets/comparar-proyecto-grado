import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav2";
import ProductCard from "../../components/ProductCard";
import type { Categoria } from "./Home";

type ProductoAPI = {
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
  categorias: Categoria[];
  address: string | null | undefined;
  onUserClick: () => void;
  onAddressClick: () => void;
  search: string;
  setSearch: (v: string) => void;
  productos: ProductoAPI[];
  totalProducts: number;
  soloOfertas: boolean;
  setSoloOfertas: React.Dispatch<React.SetStateAction<boolean>>;
  loadingProductos: boolean;
};

const HomeMobile: React.FC<Props> = ({
  categorias,
  address,
  onUserClick,
  onAddressClick,
  search,
  setSearch,
  productos,
  totalProducts,
  soloOfertas,
  setSoloOfertas,
  loadingProductos,
}) => {
  const navigate = useNavigate();

  const handleCategoriaClick = (label: string) => {
    if (label === "Bebidas") {
      navigate("/categoria_bebidas");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ================= HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md pb-2">

        <div className="px-6 py-4 flex justify-between items-center">

          {/* LOGO TEXTO */}
          <div className="text-base font-bold text-black leading-none">
            Compar<span className="text-[#EF3340]">AR</span>
          </div>

          <button
            onClick={onUserClick}
            className="!bg-transparent p-0 border-none shadow-none text-black"
          >
            <img
              src="/icons/icono_login.png"
              alt="Usuario"
              className="w-8 h-8"
            />
          </button>
        </div>

        {/* Dirección */}
        <div
          className="px-6 text-lg text-blue-600 mb-2 cursor-pointer"
          onClick={onAddressClick}
        >
          <p className="truncate">
            {address || "Agregá tu dirección"}
          </p>
        </div>

        {/* Búsqueda */}
        <div className="px-6 mb-2 mt-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full p-3 border border-gray-300 rounded-full bg-white text-black"
          />
        </div>

        {/* Categorías */}
        <div className="overflow-x-auto px-6 mt-6">
          <div className="flex gap-4 w-max pb-2">
            {categorias.map(({ icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleCategoriaClick(label)}
                className="flex flex-col items-center gap-1 shrink-0 !bg-transparent p-0 border-none"
              >
                <div className="w-20 h-20 bg-[#EF3340] rounded-full flex items-center justify-center shadow-md">
                  <img
                    src={`/icons/category_${icon}.png`}
                    alt={label}
                    className="w-10 h-10"
                  />
                </div>
                <span className="text-sm text-black text-center">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= PRODUCTOS ================= */}
      <div className="pt-[320px] pb-16 px-6 mb-6 space-y-4">

        {/* TITULO + FILTRO */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-black text-center">
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

        {loadingProductos ? (
          <>
            <p className="text-center text-gray-500">
              Cargando productos...
            </p>

            <div className="animate-pulse space-y-4">
              <div className="h-40 bg-gray-200 rounded-3xl"></div>
              <div className="h-40 bg-gray-200 rounded-3xl"></div>
              <div className="h-40 bg-gray-200 rounded-3xl"></div>
            </div>
          </>
        ) : productos.length === 0 ? (
          <p className="text-center text-gray-500">
            {search.trim()
              ? soloOfertas
                ? "No se encontraron ofertas para ese producto."
                : "Producto no disponible."
              : soloOfertas
                ? "No hay ofertas disponibles."
                : "No hay productos disponibles."}
          </p>
        ) : (
          productos.map((prod, i) => (
            <ProductCard
              key={`${prod.titulo}-${prod.supermercado}-${i}`}
              titulo={prod.titulo}
              precio_base={prod.precio_base}
              promocion={prod.promocion}
              oferta_texto={prod.oferta_texto}
              imagen={prod.imagen}
              link={prod.link}
              supermercado={prod.supermercado}
            />
          ))
        )}
      </div>

      {/* ================= BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <BottomNav />
      </div>
    </div>
  );
};

export default HomeMobile;