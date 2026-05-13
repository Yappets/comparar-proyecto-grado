// frontend/src/pages/Categorias.tsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BottomNav from "../components/BottomNav2";
import { AuthContext } from "../context/AuthContext";
import { AddressContext } from "../context/AddressContext";
import LoginPrompt from "../components/LoginModal";

const Categorias = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { address } = useContext(AddressContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleAddressClick = () => {
    if (isAuthenticated) {
      navigate("/direccion");
    } else {
      setShowLoginPrompt(true);
    }
  };

  const onLogin = () => {
    setShowLoginPrompt(false);
    navigate("/login");
  };

  const onContinueGuest = () => {
    setShowLoginPrompt(false);
  };

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth >= 768) {
        navigate("/home");
      }
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, [navigate]);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white">

        {/* ================= HEADER ================= */}
        <div className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md pb-4">

          <div className="px-6 py-4 relative flex items-center justify-center">

            {/* BACK */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-6 !bg-transparent p-0 border-none shadow-none text-black"
            >
              <ArrowLeft size={22} />
            </button>

            {/* LOGO */}
            <div className="text-base font-bold text-black leading-none">
              Compar<span className="text-[#EF3340]">AR</span>
            </div>

            {/* USUARIO */}
            <button
              onClick={handleUserIconClick}
              className="absolute right-6 !bg-transparent p-0 border-none shadow-none"
            >
              <img
                src="/icons/icono_login.png"
                alt="Usuario"
                className="w-8 h-8"
              />
            </button>
          </div>

          {/* DIRECCIÓN */}
          <div
            className="px-6 text-lg text-blue-600 mt-3 mb-4 cursor-pointer"
            onClick={handleAddressClick}
          >
            <p className="truncate text-center">
              {address || "Agregá tu dirección"}
            </p>
          </div>
        </div>

        {/* ================= CONTENIDO ================= */}
        <div className="pt-[165px] flex flex-wrap justify-around gap-4 px-6 mb-6 py-4 overflow-y-auto">

          <div className="flex flex-wrap justify-around gap-6 py-4">

            {/* ALMACÉN */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
                <img
                  src="/icons/category_almacen.png"
                  alt="Almacén"
                  className="w-14 h-14"
                />
              </div>
              <p className="mt-2 text-center">Almacén</p>
            </div>

            {/* BEBIDAS */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => navigate("/categoria_bebidas")}
                className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
              >
                <img
                  src="/icons/category_bebidas.png"
                  alt="Bebidas"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <p className="text-center mt-2">Bebidas</p>
            </div>

            {/* FRUTAS Y VERDURAS */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
                <img
                  src="/icons/category_frutas_verduras.png"
                  alt="Frutas y Verduras"
                  className="w-14 h-14"
                />
              </div>
              <p className="mt-2 text-center">Frutas y Verduras</p>
            </div>

            {/* CARNES */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
                <img
                  src="/icons/category_carnes.png"
                  alt="Carnes"
                  className="w-14 h-14"
                />
              </div>
              <p className="mt-2 text-center">Carnes</p>
            </div>

            {/* LÁCTEOS */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
                <img
                  src="/icons/category_lacteos.png"
                  alt="Lácteos"
                  className="w-14 h-14"
                />
              </div>
              <p className="mt-2 text-center">Lácteos</p>
            </div>

            {/* QUESOS Y FIAMBRES */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
                <img
                  src="/icons/category_quesos.png"
                  alt="Quesos y Fiambres"
                  className="w-14 h-14"
                />
              </div>
              <p className="mt-2 text-center">
                Quesos y <br /> Fiambres
              </p>
            </div>

            {/* HOGAR */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
                <img
                  src="/icons/category_hogar.png"
                  alt="Hogar"
                  className="w-14 h-14"
                />
              </div>
              <p className="mt-2 text-center">Hogar</p>
            </div>

            {/* PERFUMERÍA */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
                <img
                  src="/icons/category_perfumeria.png"
                  alt="Perfumería"
                  className="w-14 h-14"
                />
              </div>
              <p className="mt-2 text-center">Perfumería</p>
            </div>

            {/* LIMPIEZA */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
                <img
                  src="/icons/category_limpieza.png"
                  alt="Limpieza"
                  className="w-14 h-14"
                />
              </div>
              <p className="mt-2 text-center">Limpieza</p>
            </div>

          </div>
        </div>

        {/* ================= BOTTOM NAV ================= */}
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <BottomNav />
        </div>
      </div>

      <LoginPrompt
        isOpen={showLoginPrompt}
        onLogin={onLogin}
        onClose={onContinueGuest}
      />
    </>
  );
};

export default Categorias;