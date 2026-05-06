// DetalleProducto.tsx
import React from "react";
import DetalleProductoDesktop from "./DetalleProductoDesktop";
import DetalleProductoMobile from "./DetalleProductoMobile";

const DetalleProducto: React.FC = () => {
  return (
    <>
      {/* MOBILE */}
      <div className="block md:hidden">
        <DetalleProductoMobile />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <DetalleProductoDesktop />
      </div>
    </>
  );
};

export default DetalleProducto;