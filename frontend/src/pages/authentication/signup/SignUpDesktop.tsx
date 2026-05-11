// src/pages/signup/SignUpDesktop.tsx
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/api";

const SignUpDesktop: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingRegistro, setLoadingRegistro] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (loadingRegistro) return;

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
      setLoadingRegistro(true);

      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, acceptedTerms: accepted }),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || "Error");
        return;
      }

      localStorage.setItem("token", body.token);
      localStorage.setItem("userEmail", email);

      navigate("/");
    } catch {
      setError("Error de conexión");
    } finally {
      setLoadingRegistro(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md">

        <h2 className="text-xl font-semibold mb-6 text-center">
          Crear cuenta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl disabled:bg-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loadingRegistro}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl disabled:bg-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loadingRegistro}
            required
          />

          <input
            type="password"
            placeholder="Confirmar Password"
            className="w-full p-3 border rounded-xl disabled:bg-gray-100"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loadingRegistro}
            required
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              disabled={loadingRegistro}
            />
            Acepto términos
          </label>

          <button
            type="submit"
            disabled={loadingRegistro}
            className={`w-full text-white py-3 rounded-xl font-semibold transition ${
              loadingRegistro
                ? "!bg-gray-400 cursor-not-allowed"
                : "!bg-red-600"
            }`}
          >
            {loadingRegistro ? "Registrando..." : "Registrarse"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            disabled={loadingRegistro}
            className="w-full text-gray-500 text-sm disabled:opacity-60"
          >
            Ya tengo cuenta
          </button>

        </form>

      </div>
    </div>
  );
};

export default SignUpDesktop;