import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { useCart } from "./CartContext";
import CarritoItemCard from "../Carrito/CarritoItemCard";
import Comprar from "./Comprar";
import { AuthContext } from "../context/AuthContext";
import { AddressContext } from "../context/AddressContext";
import LoginPrompt from "../components/LoginModal";
import { calcularTotalConPromocion } from "../Carrito/CalcularPromocion";
import Checkout from "./Checkout";
import { API_URL } from "../config/api";

type Props = {
  isDrawer?: boolean;
  onClose?: () => void;
};

const ResumenCompra: React.FC<Props> = ({
  isDrawer = false,
  onClose,
}) => {
  const { totalSeleccionado } = useCart();
  const navigate = useNavigate();
  const [modoEdicion, setModoEdicion] = useState(false);

  //  NUEVO ESTADO (CLAVE)
  const [mostrarCheckout, setMostrarCheckout] = useState(false);

  const { isAuthenticated } = useContext(AuthContext);
  const { address, coords } = useContext(AddressContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { items, supermercadoSeleccionado, productosBackend } = useCart();

  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);

  const [supermercados, setSupermercados] = useState<any[]>([]);

  useEffect(() => {
  }, [supermercadoSeleccionado]);

  useEffect(() => {
    if (!coords) return;

    const fetchDistancias = async () => {
      try {
        const res = await fetch(`${API_URL}/api/supermercados/distancias?lat=${coords.lat}&lon=${coords.lon}`);

        const data = await res.json();
        setSupermercados(data);
      } catch (error) {
        console.error("Error obteniendo distancias:", error);
      }
    };

    fetchDistancias();
  }, [coords]);

  const handleBack = () => {
    if (isDrawer && onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleAddressClick = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/user/direcciones`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data || data.length === 0) {
        navigate("/direccion");
      } else {
        navigate("/mis-direcciones");
      }
    } catch (error) {
      navigate("/direccion");
    }
  };

  const handleComprar = () => {
  // 🛒 carrito vacío
  if (items.length === 0) {
    setShowEmptyCartModal(true);
    return;
  }

  // 🔐 no logueado
  if (!isAuthenticated) {
    setShowLoginPrompt(true);
    return;
  }

  // ✅ todo ok
  setMostrarCheckout(true);
};

const handleAddressClickWithAuth = () => {
  if (!isAuthenticated) {
    setShowLoginPrompt(true);
    return;
  }

  handleAddressClick();
};



  const onLogin = () => {
    setShowLoginPrompt(false);
    navigate("/login");
  };

  const onContinueGuest = () => {
    setShowLoginPrompt(false);
  };

  const total = items.reduce((acc, item) => {
    return (
      acc +
      calcularTotalConPromocion(
        item.precioBase,
        item.promocion ?? null,
        item.cantidad
      )
    );
  }, 0);

  return (
    <>
      <div className="flex flex-col h-[100dvh] bg-white">

        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-white rounded-b-3xl shadow-md px-4 py-3">
          <div className="relative flex items-center justify-center">
            <button
              onClick={() => {
                if (mostrarCheckout) {
                  setMostrarCheckout(false);
                } else {
                  handleBack();
                }
              }}
              className="absolute left-0 text-[#3A2F2F] text-xl"
            >
              <FaArrowLeft />
            </button>

            <p className="text-xl font-semibold text-black text-center">
              {mostrarCheckout ? "Checkout" : "Finalizar tu compra"}
            </p>
          </div>

          {!mostrarCheckout && (
            <div className="flex justify-center gap-4 mt-4 px-2">
              <button
                onClick={() => setModoEdicion(false)}
                className={`flex-1 font-semibold py-2 rounded-full ${
                  !modoEdicion
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-black"
                }`}
              >
                Comprar
              </button>

              <button
                onClick={() => setModoEdicion(true)}
                className={`flex-1 font-semibold py-2 rounded-full ${
                  modoEdicion
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-black"
                }`}
              >
                {modoEdicion ? "Finalizar Edición" : "Editar Carrito"}
              </button>
            </div>
          )}
        </div>

        {/* CONTENIDO SCROLL */}
        <div className="flex-1 overflow-y-auto px-4 py-6 pb-40">

          {!mostrarCheckout && (
            <>
              {modoEdicion ? (
                items.length === 0 ? (
                  <p className="text-center text-gray-500">
                    Tu carrito está vacío
                  </p>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CarritoItemCard key={item.nombre} {...item} />
                    ))}
                  </div>
                )
              ) : (
                <Comprar />
              )}
            </>
          )}

          {mostrarCheckout && (
            <Checkout supermercado={supermercadoSeleccionado} />
          )}
        </div>

        {/* FOOTER FIJO */}
        <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-2xl px-6 pt-4 pb-6 z-30">

          <div
            className="flex items-center justify-center gap-2 mb-4 cursor-pointer"
            onClick={handleAddressClickWithAuth}
          >
            <FaMapMarkerAlt className="text-blue-600 text-xl" />
            <p className="text-blue-600 font-medium text-base truncate">
              {address || "Agregá tu dirección"}
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold text-black">
              Total con descuentos
            </p>
            <p className="text-lg font-bold text-black">
              ${totalSeleccionado.toLocaleString()}
            </p>
          </div>

          <button
            onClick={handleComprar}
            className="w-full text-white font-semibold py-4 rounded-2xl shadow-md"
            style={{ backgroundColor: "#EF3340" }}
          >
            Comprar en supermercado
          </button>

        </div>

      </div>

      {/* 🔐 LOGIN */}
      <LoginPrompt
        isOpen={showLoginPrompt}
        onLogin={onLogin}
        onClose={onContinueGuest}
      />

      {/* 🛒 CARRITO VACÍO */}
      <LoginPrompt
        isOpen={showEmptyCartModal}
        onClose={() => setShowEmptyCartModal(false)}
        message="Agregá productos al carrito para continuar"
        showLoginButton={false}
      />
    </>
  );
};

export default ResumenCompra;