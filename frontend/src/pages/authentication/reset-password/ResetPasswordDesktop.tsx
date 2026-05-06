import React, { useState, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../../../config/api";

const ResetPasswordDesktop: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token") || ""; 

  const [codigo, setCodigo] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!codigo || !password || !confirm) {
      setError("Completá todos los campos");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError(null);
    setMsg(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,      
          code: codigo, 
          password,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || "Error");
        return;
      }

      setMsg("Contraseña actualizada correctamente");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md">

        <h2 className="text-xl font-semibold mb-6 text-center">
          Nueva contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {msg && <p className="text-green-600 text-sm">{msg}</p>}

          <input
            type="text"
            placeholder="Código de verificación"
            className="w-full p-3 border rounded-xl"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full p-3 border rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full p-3 border rounded-xl"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button className="w-full !bg-red-600 text-white py-3 rounded-xl">
            Cambiar contraseña
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

export default ResetPasswordDesktop;