// src/pages/authentication/forgot-password/ForgotPasswordMobile.tsx

import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/api";
import { ArrowLeft } from "lucide-react";

const ForgotPasswordMobile: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!email) {
      setError("Ingresá un email");
      return;
    }

    setError(null);
    setMsg(null);
    setLoading(true);

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
        setError(body.error || "Error del servidor");
        return;
      }

      setMsg("Te enviamos un email con instrucciones");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* BACK */}
      <div className="p-4 flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="text-black disabled:opacity-60"
          disabled={loading}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* CARD */}
      <div className="flex-1 flex items-center justify-center px-4">

        <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-md">

          <h2 className="text-lg font-semibold mb-4 text-center">
            Recuperar contraseña
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {msg && <p className="text-green-600 text-sm">{msg}</p>}

            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="w-full p-3 border rounded-xl disabled:bg-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-xl font-semibold transition ${
                loading
                  ? "!bg-gray-400 cursor-not-allowed"
                  : "!bg-[#EF3340]"
              }`}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={loading}
              className="w-full text-gray-500 text-sm disabled:opacity-60"
            >
              Volver al login
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordMobile;