import React, { useState } from "react";
import { Home, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Carrito/CartContext"; // 

type NavItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

const BottomNav = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
const { cartCount } = useCart(); // ✅ accede directamente al valor correcto

  const navItems: NavItem[] = [
    {
      label: "Inicio",
      icon: <Home size={28} className="sm:size-36 md:size-44" />,
      onClick: () => {
        setActiveIndex(0);
        navigate("/home");
      },
    },
    {
      label: "Categorías",
      icon: <Search size={28} className="sm:size-36 md:size-44" />,
      onClick: () => {
        setActiveIndex(1);
        navigate("/categorias");
      },
    },
  ];

  return (
   <div className="relative w-full flex-shrink-0">
      {/* Botón flotante del carrito */}
      <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={() => navigate("/resumen")}
          style={{ borderRadius: "9999px", backgroundColor: "#ef2a39" }}
          className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-lg"
        >
          <img
            src="/icons/icono_carrito.png"
            alt="Carrito"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
          />
          {/* Contador azul dinámico */}
          {cartCount > 0 && (
            <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-600 text-white text-xs sm:text-sm md:text-base rounded-full flex items-center justify-center shadow-md">
              {cartCount}
            </div>
          )}
        </button>
      </div>

      {/* Bottom nav */}
      <nav className="w-full bg-white border-t  border-gray-200 shadow-md pt-6">
        <ul className="flex justify-around items-center h-20 sm:h-24 md:h-28">
          {navItems.map((item, index) => (
            <li
              key={item.label}
              onClick={item.onClick}
              className={`flex flex-col items-center cursor-pointer transition-colors ${
                activeIndex === index ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {item.icon}
              <span className="text-sm sm:text-lg md:text-2xl">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default BottomNav;
