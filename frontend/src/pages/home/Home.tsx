import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AddressContext } from "../../context/AddressContext";
import LoginPrompt from "../../components/LoginModal";
import HomeMobile from "./HomeMobile";
import HomeDesktop from "./HomeDesktop";
import { API_URL } from "../../config/api";

type ProductoApi = {
  titulo: string;
  precio_base: number;
  promocion: any | null;
  oferta_texto: string;
  imagen: string;
  supermercado: string;
  link: string;
  producto_key: string;
};

export type Categoria = {
  icon: string;
  label: string;
};

const ITEMS_POR_PAGINA_DESKTOP = 6;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { address } = useContext(AddressContext);
  const [soloOfertas, setSoloOfertas] = useState(true);

  const [productos, setProductos] = useState<ProductoApi[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [search, setSearch] = useState("");
  const [pageDesktop, setPageDesktop] = useState(1);

  const categorias: Categoria[] = useMemo(
    () => [
      { icon: "almacen", label: "Almacén" },
      { icon: "bebidas", label: "Bebidas" },
      { icon: "carnes", label: "Carnes" },
      { icon: "frutas_verduras", label: "Frutas y Verduras" },
      { icon: "lacteos", label: "Lácteos" },
      { icon: "limpieza", label: "Limpieza" },
      { icon: "perfumeria", label: "Perfumería" },
      { icon: "quesos", label: "Quesos" },
    ],
    []
  );

  /* ================= FETCH ================= */

  useEffect(() => {
    setLoadingProductos(true);

    fetch(`${API_URL}/api/productos`)
      .then((res) => res.json())
      .then((data: ProductoApi[]) => {
        setProductos(data);
      })
      .catch((err) =>
        console.error("Error al cargar productos en Home:", err)
      )
      .finally(() => {
        setLoadingProductos(false);
      });
  }, []);

  /* ================= HANDLERS ================= */

  const handleUserIconClick = () => {
    if (isAuthenticated) navigate("/profile");
    else navigate("/login");
  };

  const handleAddressClick = async () => {
    // SI NO ESTÁ LOGUEADO → POPUP
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    //  SI ESTÁ LOGUEADO → BACKEND
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
      console.error(error);
      navigate("/direccion");
    }
  };

  const onLogin = () => {
    setShowLoginPrompt(false);
    navigate("/login");
  };

  const onContinueGuest = () => {
    setShowLoginPrompt(false);
  };

  /* ================= FILTRO ================= */

  const productosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();

    // 🔍 SI HAY BÚSQUEDA → IGNORA FILTRO
    if (q) {
      return productos.filter((p) =>
        p.titulo.toLowerCase().includes(q)
      );
    }

    // FILTRO DE OFERTAS
    if (soloOfertas) {
      return productos.filter((p) => p.promocion !== null);
    }

    // TODOS LOS PRODUCTOS
    return productos;
  }, [productos, search, soloOfertas]);

  useEffect(() => {
    setPageDesktop(1);
  }, [search]);

  /* ================= PAGINACIÓN DESKTOP ================= */

  const totalPagesDesktop = useMemo(() => {
    return Math.max(
      1,
      Math.ceil(
        productosFiltrados.length / ITEMS_POR_PAGINA_DESKTOP
      )
    );
  }, [productosFiltrados.length]);

  const pageDesktopSafe = useMemo(() => {
    return Math.min(pageDesktop, totalPagesDesktop);
  }, [pageDesktop, totalPagesDesktop]);

  const productosDesktopPaginados = useMemo(() => {
    const start =
      (pageDesktopSafe - 1) * ITEMS_POR_PAGINA_DESKTOP;

    return productosFiltrados.slice(
      start,
      start + ITEMS_POR_PAGINA_DESKTOP
    );
  }, [productosFiltrados, pageDesktopSafe]);

  /* ================= RENDER ================= */

  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden">
        <HomeMobile
          categorias={categorias}
          address={address}
          onUserClick={handleUserIconClick}
          onAddressClick={handleAddressClick}
          search={search}
          setSearch={setSearch}
          productos={productosFiltrados}
          loadingProductos={loadingProductos}
        />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <HomeDesktop
          categorias={categorias}
          address={address}
          onUserClick={handleUserIconClick}
          onAddressClick={handleAddressClick}
          search={search}
          setSearch={setSearch}
          productos={productosDesktopPaginados}
          totalProducts={productosFiltrados.length}
          page={pageDesktopSafe}
          totalPages={totalPagesDesktop}
          setPage={setPageDesktop}
          soloOfertas={soloOfertas}
          setSoloOfertas={setSoloOfertas}
          loadingProductos={loadingProductos}
        />
      </div>

      <LoginPrompt
        isOpen={showLoginPrompt}
        onLogin={onLogin}
        onClose={onContinueGuest}
      />
    </>
  );
};

export default Home;