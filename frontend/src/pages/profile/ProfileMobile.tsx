// src/pages/profile/ProfileMobile.tsx
import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AddressContext } from "../../context/AddressContext";
import LoginPrompt from "../../components/LoginModal";
import BottomNav from "../../components/BottomNav2";
import { User, LogOut, ArrowLeft } from "lucide-react";

const obtenerEmailUsuario = () => {
  try {
    // 1) Si en algún login guardaste el email directo
    const emailDirecto = localStorage.getItem("userEmail");
    if (emailDirecto) return emailDirecto;

    // 2) Si guardaste un objeto usuario
    const usuarioGuardado = localStorage.getItem("user");
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      if (user?.email) return user.email;
    }

    // 3) Si el token JWT tiene el email dentro del payload
    const token = localStorage.getItem("token");
    if (token) {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));

      if (decoded?.email) return decoded.email;
    }

    return "Email no disponible";
  } catch (error) {
    return "Email no disponible";
  }
};

const ProfileMobile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { clearAddress } = useContext(AddressContext);

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const emailUsuario = useMemo(() => obtenerEmailUsuario(), []);

  const handleLogout = () => {
    logout();
    clearAddress();
    navigate("/home");
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
          <div className="text-xl font-bold tracking-tight text-black">
            Compar<span className="text-[#EF3340]">AR</span>
          </div>

        </div>

      </div>

      {/* CONTENIDO */}
      <div className="pt-[120px] px-6 flex-1">
        <h2 className="text-center text-xl text-[#3A2F2F]">
          Bienvenido
        </h2>

        <div className="mt-8 space-y-4">

          {/* EMAIL DE LA CUENTA */}
          <div className="w-full flex items-center gap-4 bg-white p-4 rounded-2xl shadow-md">
            <User size={22} className="text-gray-700" />

            <div className="min-w-0">
              <p className="text-sm text-gray-500">
                Cuenta
              </p>
              <p className="font-medium text-black break-all">
                {emailUsuario}
              </p>
            </div>
          </div>

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