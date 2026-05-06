import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav2";
import { AuthContext } from "../context/AuthContext";
import { AddressContext } from "../context/AddressContext";
import LoginPrompt from "../components/LoginModal"; // Asegúrate de que la exportación coincida
import React, { useEffect, useState, useContext } from "react";

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
    // permanece en Home
  };

  useEffect(() => {
  const checkScreen = () => {
    if (window.innerWidth >= 768) {
      navigate("/home");
    }
  };

  checkScreen(); // 

  window.addEventListener("resize", checkScreen);

  return () => window.removeEventListener("resize", checkScreen);
}, [navigate]);

  

  return (
  <div className="min-h-screen flex flex-col bg-white">
    
    {/* ================= HEADER ================= */}
    <div className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md pb-2">
      
      <div className="px-6 py-4 flex justify-between items-center">
          <div className="text-base font-bold text-black leading-none">
            Compar<span className="text-[#EF3340]">AR</span>
          </div>

        <button onClick={handleUserIconClick}>
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
        onClick={handleAddressClick}
      >
        <p className="truncate">
          {address || "Agregá tu dirección"}
        </p>
      </div>

    
    </div>

    {/* ================= CONTENIDO ================= */}
    {/* 🔥 MISMA LOGICA QUE HOME */}
    <div className="pt-[140px] flex flex-wrap justify-around gap-4 px-6 mb-6 py-4 overflow-y-auto">

      <div className="flex flex-wrap justify-around gap-6 py-4">

        {/* Categorías */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
            <img src="/icons/category_almacen.png" className="w-14 h-14" />
          </div>
          <p className="mt-2 text-center">Almacen</p>
        </div>

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

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
            <img src="/icons/category_frutas_verduras.png" className="w-14 h-14" />
          </div>
          <p className="mt-2 text-center">Frutas y Verduras</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
            <img src="/icons/category_carnes.png" className="w-14 h-14" />
          </div>
          <p className="mt-2 text-center">Carnes</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
            <img src="/icons/category_lacteos.png" className="w-14 h-14" />
          </div>
          <p className="mt-2 text-center">Lácteos</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
            <img src="/icons/category_quesos.png" className="w-14 h-14" />
          </div>
          <p className="mt-2 text-center">
            Quesos y <br /> Fiambres
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
            <img src="/icons/category_hogar.png" className="w-14 h-14" />
          </div>
          <p className="mt-2 text-center">Hogar</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
            <img src="/icons/category_perfumeria.png" className="w-14 h-14" />
          </div>
          <p className="mt-2 text-center">Perfumeria</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
            <img src="/icons/category_limpieza.png" className="w-14 h-14" />
          </div>
          <p className="mt-2 text-center">Limpieza</p>
        </div>

      </div>
    </div>

    {/* ================= BOTTOM NAV ================= */}
    {/* 🔥 EXACTAMENTE IGUAL QUE HOME */}
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <BottomNav />
    </div>
  </div>
);
};

export default Categorias;
