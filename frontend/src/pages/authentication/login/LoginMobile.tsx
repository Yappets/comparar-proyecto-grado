// src/pages/authentication/login/LoginMobile.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Props = {
  email: string;
  password: string;
  error: string | null;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loadingLogin: boolean;
};

const LoginMobile: React.FC<Props> = ({
  email,
  password,
  error,
  setEmail,
  setPassword,
  handleSubmit,
  loadingLogin,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* TOP BAR */}
      <div className="p-4 flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="text-black"
          disabled={loadingLogin}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* HEADER ROJO */}
      <div className="bg-gradient-to-b from-[#EF3340] to-[#FF5A6E] py-8 px-6 text-white rounded-b-[30px]">

        <div className="flex flex-col items-center">

          <h1 className="text-4xl font-bold tracking-tight">
            Compar<span className="text-black">AR</span>
          </h1>

          <p className="text-sm mt-2 opacity-90 text-center px-6">
            Compará precios de forma inteligente
          </p>

        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 px-6 mt-10"
      >

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* EMAIL */}
        <div>
          <label className="text-sm text-gray-600 ml-2">Email</label>
          <input
            type="email"
            placeholder="Ingrese correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loadingLogin}
            className="w-full mt-1 p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EF3340] disabled:bg-gray-100"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm text-gray-600 ml-2">Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loadingLogin}
            className="w-full mt-1 p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EF3340] disabled:bg-gray-100"
          />
        </div>

        {/* LOGIN */}
        <button
          type="submit"
          disabled={loadingLogin}
          className={`w-full text-white py-3 rounded-xl font-semibold transition ${
            loadingLogin
              ? "!bg-gray-400 cursor-not-allowed"
              : "!bg-[#EF3340]"
          }`}
        >
          {loadingLogin ? "Iniciando sesión..." : "Ingresar"}
        </button>

        {/* REGISTER */}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          disabled={loadingLogin}
          className="w-full !bg-gray-800 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
        >
          Registrarse
        </button>

        {/* INVITADO */}
        <button
          type="button"
          onClick={() => navigate("/")}
          disabled={loadingLogin}
          className="text-sm text-gray-500 text-center mt-2 disabled:opacity-60"
        >
          Continuar como invitado
        </button>

        {/* FORGOT */}
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          disabled={loadingLogin}
          className="text-sm text-blue-600 text-center disabled:opacity-60"
        >
          ¿Olvidaste tu contraseña?
        </button>

      </form>
    </div>
  );
};

export default LoginMobile;