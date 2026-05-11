// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";

import { CartProvider } from "./Carrito/CartContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { AddressProvider } from "./context/AddressContext";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* ======================================================
   CONFIGURACIÓN ICONO LEAFLET
   Necesario para que el marcador se vea correctamente
   en producción, especialmente en Vercel.
====================================================== */

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <AddressProvider>
          <App />
        </AddressProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);