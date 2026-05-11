// src/pages/profile/ProfileDesktop.tsx
import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AddressContext } from "../../context/AddressContext";
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

const ProfileDesktop: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { clearAddress } = useContext(AddressContext);

  const emailUsuario = useMemo(() => obtenerEmailUsuario(), []);

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
          <div className="text-2xl font-bold tracking-tight text-black">
            Compar<span className="text-[#EF3340]">AR</span>
          </div>

        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Bienvenido
        </h2>

        <div className="space-y-4">

          {/* EMAIL DE LA CUENTA */}
          <div className="w-full flex items-center gap-4 p-4 border rounded-xl bg-gray-50">
            <User size={22} className="text-gray-700" />

            <div>
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