// src/pages/home/HomeDesktop.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Carrito/CartContext";
import ProductCard from "../../components/ProductCard";
import ResumenCompra from "../../Carrito/ResumenCompra";
import Pagination from "../../components/Pagination";
import type { Categoria } from "./Home";

type ProductoAPI = {
  titulo: string;
  precio_base: number;
  promocion: any | null;
  oferta_texto: string;
  imagen: string;
  supermercado: string;
  link: string;
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
  page: number;
  totalPages: number;
  setPage: (n: number) => void;
  soloOfertas: boolean;
  setSoloOfertas: React.Dispatch<React.SetStateAction<boolean>>;
  loadingProductos: boolean;
};

const HomeDesktop: React.FC<Props> = ({
  categorias,
  address,
  onUserClick,
  onAddressClick,
  search,
  setSearch,
  productos,
  totalProducts,
  page,
  totalPages,
  setPage,
  soloOfertas,
  setSoloOfertas,
  loadingProductos,
}) => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categoriasConAll = useMemo(
    () => [{ icon: "all", label: "Todas" }, ...categorias],
    [categorias]
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">

          <h1 className="text-2xl font-bold tracking-tight">
            Compar<span className="text-[#EF3340]">AR</span>
          </h1>

          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full bg-white"
            />
          </div>

          <button
            onClick={onAddressClick}
            className="text-blue-600 font-medium max-w-[260px] truncate px-3 py-2 rounded-xl hover:bg-blue-50"
          >
            {address || "Agregá tu dirección"}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-14 h-14 rounded-full !bg-red-600 hover:bg-[#d82b37] flex items-center justify-center shadow-md transition"
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

          <button
            onClick={onUserClick}
            className="!bg-transparent p-0 border-none shadow-none"
          >
            <img
              src="/icons/icono_login.png"
              alt="Usuario"
              className="w-10 h-10"
            />
          </button>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 py-6">

        {/* TITULO + FILTRO */}
        <div className="grid grid-cols-12 mb-6">
          <div className="col-span-3" />
          <div className="col-span-9 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {soloOfertas ? "Ofertas destacadas" : "Todos los productos"}
            </h2>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {loadingProductos
                  ? "Cargando..."
                  : `${totalProducts} ${soloOfertas ? "ofertas" : "productos"}`}
              </span>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">
                  Solo ofertas
                </span>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soloOfertas}
                    onChange={() => setSoloOfertas((prev) => !prev)}
                    className="sr-only peer"
                  />

                  {/* Fondo */}
                  <div className="w-12 h-7 bg-gray-400 rounded-full peer peer-checked:bg-gray-500 transition" />

                  {/* Círculo */}
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition peer-checked:translate-x-5" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-12 gap-6 items-stretch">

          {/* SIDEBAR */}
          <aside className="col-span-3">
            <div className="bg-white rounded-2xl border shadow-sm p-4 h-full">

              <h3 className="font-semibold mb-3">Categorías</h3>

              <div className="space-y-1">
                {categoriasConAll.map(({ icon, label }) => (
                  <button
                    key={label}
                    onClick={() => {
                      if (label === "Bebidas")
                        navigate("/categoria_bebidas");
                      else if (label === "Todas")
                        navigate("/Home");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-gray-50"
                  >
                    <div className="w-10 h-10 bg-[#EF3340] rounded-xl flex items-center justify-center">
                      {icon === "all" ? (
                        <span className="text-white font-bold text-lg">≡</span>
                      ) : (
                        <img
                          src={`/icons/category_${icon}.png`}
                          alt={label}
                          className="w-6 h-6"
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {label}
                    </span>
                  </button>
                ))}
              </div>

            </div>
          </aside>

          {/* PRODUCTOS */}
          <section className="col-span-9">
            {loadingProductos ? (
              <div className="space-y-4">
                <p className="text-center text-gray-500">
                  Cargando productos...
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  <div className="h-80 bg-gray-200 rounded-3xl"></div>
                  <div className="h-80 bg-gray-200 rounded-3xl"></div>
                  <div className="h-80 bg-gray-200 rounded-3xl"></div>
                  <div className="h-80 bg-gray-200 rounded-3xl"></div>
                  <div className="h-80 bg-gray-200 rounded-3xl"></div>
                  <div className="h-80 bg-gray-200 rounded-3xl"></div>
                </div>
              </div>
            ) : productos.length === 0 ? (
              <div className="text-center text-gray-500 py-16">
                No se encontraron productos.
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {productos.map((prod, i) => (
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
                ))}
              </div>
            )}
          </section>
        </div>

        {/* PAGINACIÓN */}
        {!loadingProductos && totalPages > 1 && (
          <div className="grid grid-cols-12 mt-3">
            <div className="col-span-3" />
            <div className="col-span-9">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          </div>
        )}

      </main>

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

export default HomeDesktop;