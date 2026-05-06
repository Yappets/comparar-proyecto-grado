// src/pages/auth/LoginDesktop.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  email: string;
  password: string;
  error: string | null;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

const LoginDesktop: React.FC<Props> = ({
  email,
  password,
  error,
  setEmail,
  setPassword,
  handleSubmit,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      
       {/* LADO IZQUIERDO */}
      <div className="w-1/2 bg-gradient-to-br from-[#EF3340] to-[#FF5A6E] flex flex-col justify-center items-center text-white px-10">

        {/* LOGO TEXTO (NUEVO) */}
        <h1 className="text-5xl font-bold mb-6 tracking-tight">
          Compar<span className="text-black">AR</span>
        </h1>

        <h2 className="text-3xl font-semibold mb-4 text-center">
          Compará precios de forma inteligente
        </h2>


      </div>

      {/* LADO DERECHO */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-[400px]">

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Iniciar sesión
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Ingrese correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border rounded-xl"
              required
            />

            <input
              type="password"
              placeholder="Ingrese contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border rounded-xl"
              required
            />

            <button
              type="submit"
              className="!bg-[#EF3340] text-white py-3 rounded-xl font-semibold"
            >
              Ingresar
            </button>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="!bg-gray-800 text-white py-3 rounded-xl font-semibold"
            >
              Registrarse
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 mt-2"
            >
              Continuar como invitado
            </button>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 hover:underline text-center"
            >
              ¿Olvidaste tu contraseña?
            </button>



          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginDesktop;