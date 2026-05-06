// src/pages/profile/ProfileDesktop.tsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AddressContext } from "../../context/AddressContext";
import { User, LogOut, ArrowLeft } from "lucide-react";

const ProfileDesktop: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { clearAddress, address } = useContext(AddressContext);

  const handleLogout = () => {
    logout();
    clearAddress();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">

          {/* BACK */}
          <button onClick={() => navigate(-1)} className="text-black">
            <ArrowLeft size={24} />
          </button>

          {/* LOGO */}
          <img src="/icons/icono_preciosya.png" className="w-32" />

        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-6">
          Bienvenido
        </h2>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/profile/data")}
            className="w-full flex items-center gap-4 p-4 border rounded-xl"
          >
            <User size={22} className="text-gray-700" />
            Mis datos
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 border rounded-xl"
          >
            <LogOut size={22} className="text-red-500" />
            Cerrar Sesión
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProfileDesktop;