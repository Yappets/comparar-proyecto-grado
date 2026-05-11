// src/pages/auth/Login.tsx
import React, { useState, FormEvent, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginDesktop from "./LoginDesktop";
import LoginMobile from "./LoginMobile";
import { API_URL } from "../../../config/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || "Error");
        return;
      }

      // Guarda el token en el contexto/autenticación.
      login(body.token);

      // Guarda el email para poder mostrarlo después en el perfil.
      localStorage.setItem("userEmail", email);

      navigate("/");
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <>
      {/* MOBILE */}
      <div className="block md:hidden">
        <LoginMobile
          email={email}
          password={password}
          error={error}
          setEmail={setEmail}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <LoginDesktop
          email={email}
          password={password}
          error={error}
          setEmail={setEmail}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default Login;