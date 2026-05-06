// src/main.tsx (o index.tsx)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { CartProvider } from './Carrito/CartContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';  // <-- importa tu AuthProvider
import 'leaflet/dist/leaflet.css';
import { AddressProvider } from './context/AddressContext';
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById('root')!).render(
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
