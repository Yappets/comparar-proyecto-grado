import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { API_URL } from "../config/api";
/* ======================================================
   TIPOS
====================================================== */

export type ProductoCarrito = {
  nombre: string;
  precioBase: number; 
  imagen: string;
  cantidad: number;
  promocion?: any | null;
  link: string;
  supermercado: string;
};

export type ProductoDisponible = {
  titulo: string;
  precio_base: number;
  promocion: any | null;
  oferta_texto: string;
  imagen: string;
  supermercado: string;
  link: string;
  marca?: string;
};

type CartContextType = {
  items: ProductoCarrito[];
  cartCount: number;
  addToCart: (producto: ProductoCarrito) => void;
  removeFromCart: (nombre: string) => void;
  vaciarCarrito: () => void;
  updateCantidad: (nombre: string, cantidad: number) => void;
  supermercadoSeleccionado: string | null;
  setSupermercadoSeleccionado: (nombre: string) => void;
  productosBackend: ProductoDisponible[];
  setProductosBackend: (productos: ProductoDisponible[]) => void;
  productosSeleccionados: ProductoDisponible[];
  setProductosSeleccionados: (productos: ProductoDisponible[]) => void;
  totalSeleccionado: number;
  setTotalSeleccionado: (total: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

/* ======================================================
   PROVIDER
====================================================== */

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [totalSeleccionado, setTotalSeleccionado] = useState(0);
  const [items, setItems] = useState<ProductoCarrito[]>([]);
  const [supermercadoSeleccionado, setSupermercadoSeleccionado] =
    useState<string | null>(null);
  const [productosBackend, setProductosBackend] =
    useState<ProductoDisponible[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] =
    useState<ProductoDisponible[]>([]);

  /* ======================================================
     FETCH PRODUCTOS
  ====================================================== */

  useEffect(() => {
    fetch(`${API_URL}/api/productos`)
      .then((res) => res.json())
      .then((data) => setProductosBackend(data))
      .catch((err) =>
        console.error("Error cargando productos", err)
      );
  }, []);

  useEffect(() => {
  }, [supermercadoSeleccionado]);

  /* ======================================================
     ADD TO CART (MISMA LÓGICA)
  ====================================================== */

  const addToCart = (producto: ProductoCarrito) => {
    setItems((prev) => {
      if (!supermercadoSeleccionado) {
        setSupermercadoSeleccionado(producto.supermercado);
      }

      const existente = prev.find(
        (item) => item.nombre === producto.nombre
      );

      if (existente) {
        return prev.map((item) =>
          item.nombre === producto.nombre
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  /* ======================================================
     REMOVE
  ====================================================== */

  const removeFromCart = (nombre: string) => {
    setItems((prev) =>
      prev.filter((item) => item.nombre !== nombre)
    );
  };

  /* ======================================================
     VACIAR
  ====================================================== */

  const vaciarCarrito = () => {
    setItems([]);
    setSupermercadoSeleccionado(null);
    setProductosSeleccionados([]);
  };

  /* ======================================================
     UPDATE CANTIDAD
  ====================================================== */

  const updateCantidad = (
    nombre: string,
    cantidad: number
  ) => {
    if (cantidad <= 0) {
      removeFromCart(nombre);
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.nombre === nombre
            ? { ...item, cantidad }
            : item
        )
      );
    }
  };

  const cartCount = items.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        addToCart,
        removeFromCart,
        vaciarCarrito,
        updateCantidad,
        supermercadoSeleccionado,
        setSupermercadoSeleccionado,
        productosBackend,
        setProductosBackend,
        productosSeleccionados,
        setProductosSeleccionados,
        totalSeleccionado,
        setTotalSeleccionado,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};