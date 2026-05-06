import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home/Home";
import CategoriasBebidas from "./Categorias/CategoriasBebidas/CategoriasBebidas";
import Categorias from "./Categorias/Categorias";


import DetalleProducto from "./pages/detalle_producto/DetalleProducto";
import Login from "./pages/authentication/login/Login";
import SignUp from "./pages/authentication/signup/SignUp";
import Profile from "./pages/profile/Profile";

import ResumenCompra from "./Carrito/ResumenCompra";


import Direccion from "./pages/direccion/Direccion";
import DireccionesGuardadas from "./pages/direccion/DireccionesGuardadas";
import FormularioDireccion from "./pages/direccion/FormularioDireccion";
import Mapa from "./pages/direccion/Mapa";

import ForgotPassword from "./pages/authentication/forgot-password/ForgotPassword";
import ResetPassword from "./pages/authentication/reset-password/ResetPassword";

function RoutesComponent() {
  return (
    <Router>
      <Routes>
        {/* HOME */}
        <Route path="/home" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PRODUCTO */}
        <Route path="/producto/:nombre" element={<DetalleProducto />} />

        {/* CATEGORÍAS */}
        <Route path="/categorias" element={<Categorias />} />
        <Route
          path="/categoria_bebidas"
          element={<CategoriasBebidas />}
        />
       

        {/* CARRITO */}
        <Route path="/resumen" element={<ResumenCompra />} />
        

        {/* DIRECCIÓN */}
        <Route path="/direccion" element={<Direccion />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/detalles_direccion" element={<FormularioDireccion />} />
        <Route path="/mis-direcciones" element={<DireccionesGuardadas />} />

        {/* REDIRECCIÓN INICIAL */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* RUTAS INVÁLIDAS */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default RoutesComponent;