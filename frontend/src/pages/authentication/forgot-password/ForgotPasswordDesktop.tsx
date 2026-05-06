// src/pages/autenticacion/ForgotPasswordDesktop.tsx
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/api";

const ForgotPasswordDesktop: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMsg(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/request-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || "Error");
        return;
      }

      setMsg("Te enviamos un email con instrucciones");

    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md">

        <h2 className="text-xl font-semibold mb-6 text-center">
          Recuperar contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {msg && <p className="text-green-600 text-sm">{msg}</p>}

          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="w-full p-3 border rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="w-full !bg-red-600 text-white py-3 rounded-xl">
            Enviar
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-gray-500 text-sm"
          >
            Volver al login
          </button>

        </form>

      </div>
    </div>
  );
};

export default ForgotPasswordDesktop;