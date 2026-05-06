// src/components/LoginPrompt.tsx
import React from "react";

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;

  
  message?: string;
  showLoginButton?: boolean;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({
  isOpen,
  onClose,
  onLogin,
  message,
  showLoginButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md text-center shadow-xl">

        {/* MENSAJE */}
        <p className="text-lg mb-6">
          {message || "Se requiere iniciar sesión para continuar"}
        </p>

        {/* BOTÓN LOGIN (solo si corresponde) */}
        {showLoginButton && (
          <button
            onClick={onLogin}
            className="w-full py-3 mb-4 !bg-[#3A2F2F] text-white rounded-xl"
          >
            Iniciar sesión
          </button>
        )}

        {/* BOTÓN CIERRE */}
        <button
          onClick={onClose}
          className="w-full py-3 !bg-gray-200 border border-gray-300 text-gray-800 rounded-xl"
        >
          {showLoginButton ? "Continuar como invitado" : "Entendido"}
        </button>

      </div>
    </div>
  );
};

export default LoginPrompt;