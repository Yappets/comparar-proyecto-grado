// src/pages/signup/SignUpMobile.tsx
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/api";


const SignUpMobile: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!accepted) {
      setError("Debes aceptar los Términos y Condiciones");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, acceptedTerms: accepted }),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || "Error al registrarse");
        return;
      }

      localStorage.setItem("token", body.token);
      navigate("/");

    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* HEADER */}
      <div className="bg-gradient-to-b from-[#F72545] to-[#FF416C] rounded-b-[40px] p-4 relative">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-2xl absolute top-4 left-4"
        >
          ←
        </button>

        <div className="flex justify-center mt-12">
          <img
            src="/icons/icono_pantalla_login.png"
            className="w-32 h-32"
          />
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="px-6 mt-6 space-y-4">

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-2xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-2xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar Password"
          className="w-full p-3 border rounded-2xl"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          Acepto términos
        </label>

        <button className="w-full bg-[#3A2F2F] text-white py-3 rounded-2xl">
          Registrarse
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-center text-gray-500 w-full"
        >
          Ya tengo cuenta
        </button>

      </form>
    </div>
  );
};

export default SignUpMobile;