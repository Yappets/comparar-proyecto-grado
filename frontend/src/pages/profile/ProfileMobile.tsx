// src/pages/profile/ProfileMobile.tsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AddressContext } from "../../context/AddressContext";
import LoginPrompt from "../../components/LoginModal";
import BottomNav from "../../components/BottomNav2";
import { User, LogOut, ArrowLeft } from "lucide-react";

const ProfileMobile: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useContext(AuthContext);
  const { address, clearAddress } = useContext(AddressContext);

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleLogout = () => {
    logout();
    clearAddress();
    navigate("/home");
  };

  const handleAddressClick = () => {
    if (isAuthenticated) {
      navigate("/direccion");
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <div className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md pb-2">
  
        <div className="px-6 py-4 flex items-center gap-4">

          {/* BACK */}
          <button onClick={() => navigate(-1)} className="text-black">
            <ArrowLeft size={24} />
          </button>

          {/* LOGO */}
          <img src="/icons/icono_preciosya.png" className="w-24" />

        </div>


      </div>

      {/* CONTENIDO */}
      <div className="pt-[140px] px-6 flex-1">
        <h2 className="text-center text-xl text-[#3A2F2F]">
          Bienvenido
        </h2>

        <div className="mt-8 space-y-4">
         <button
            onClick={() => navigate("/profile/data")}
            className="w-full flex items-center gap-4 bg-white p-4 rounded-2xl shadow-md"
          >
            <User size={22} className="text-gray-700" />
            Mis datos
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 bg-white p-4 rounded-2xl shadow-md"
          >
            <LogOut size={22} className="text-red-500" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav />
      </div>

      <LoginPrompt
        isOpen={showLoginPrompt}
        onLogin={() => navigate("/login")}
        onClose={() => setShowLoginPrompt(false)}
      />
    </div>
  );
};

export default ProfileMobile;