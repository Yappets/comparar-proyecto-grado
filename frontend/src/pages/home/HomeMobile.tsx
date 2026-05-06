import React from "react";
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
};

const HomeMobile: React.FC<Props> = ({
  categorias,
  address,
  onUserClick,
  onAddressClick,
  search,
  setSearch,
  productos,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* ================= HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md pb-2">
        
        <div className="px-6 py-4 flex justify-between items-center">
  
          {/* LOGO TEXTO */}
          <div className="text-base font-bold text-black leading-none">
            Compar<span className="text-[#EF3340]">AR</span>
          </div>

          <button onClick={onUserClick} className="text-black">
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
            className="w-full p-3 border border-gray-300 rounded-full"
          />
        </div>

        {/* Categorías */}
        <div className="overflow-x-auto px-6 mt-6">
          <div className="flex gap-4 w-max pb-2">
            {categorias.map(({ icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 shrink-0"
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= PRODUCTOS ================= */}
      <div className="pt-[320px] pb-16 px-6 mb-6 space-y-4">
        {productos.map((prod, i) => (
          <ProductCard
            key={`${prod.titulo}-${i}`}
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

      {/* ================= BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <BottomNav />
      </div>
    </div>
  );
};

export default HomeMobile;