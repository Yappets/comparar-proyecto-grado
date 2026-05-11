// src/pages/authentication/login/Login.tsx
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
  const [loadingLogin, setLoadingLogin] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (loadingLogin) return;

    setError(null);
    setLoadingLogin(true);

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

      login(body.token);

      // Guarda el email para mostrarlo en el perfil.
      localStorage.setItem("userEmail", email);

      navigate("/");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoadingLogin(false);
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
          loadingLogin={loadingLogin}
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
          loadingLogin={loadingLogin}
        />
      </div>
    </>
  );
};

export default Login;