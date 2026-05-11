import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import CategoriasBebidasDesktop from "./CategoriasBebidasDesktop";
import CategoriasBebidasMobile from "./CategoriasBebidasMobile";
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

const ITEMS_POR_PAGINA = 6;

const CategoriasBebidas: React.FC = () => {
  const [productos, setProductos] = useState<ProductoApi[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [soloOfertas, setSoloOfertas] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ================= FETCH ================= */

  useEffect(() => {
    setLoadingProductos(true);

    fetch(`${API_URL}/api/productos`)
      .then((res) => res.json())
      .then((data: ProductoApi[]) => {
        setProductos(data);
      })
      .catch((err) =>
        console.error("Error al cargar productos en Categoría Bebidas:", err)
      )
      .finally(() => {
        setLoadingProductos(false);
      });
  }, []);

  /* ================= FILTRO (CLON HOME) ================= */

  const productosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (q) {
      return productos.filter((p) =>
        p.titulo.toLowerCase().includes(q)
      );
    }

    if (soloOfertas) {
      return productos.filter((p) => p.promocion !== null);
    }

    return productos;
  }, [productos, search, soloOfertas]);

  /* RESET PAGINA */
  useEffect(() => {
    setPage(1);
  }, [search, soloOfertas]);

  /* ================= PAGINACIÓN ================= */

  const totalPages = useMemo(() => {
    return Math.max(
      1,
      Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA)
    );
  }, [productosFiltrados.length]);

  const pageSafe = Math.min(page, totalPages);

  const productosPaginados = useMemo(() => {
    const start = (pageSafe - 1) * ITEMS_POR_PAGINA;

    return productosFiltrados.slice(
      start,
      start + ITEMS_POR_PAGINA
    );
  }, [productosFiltrados, pageSafe]);

  const sharedProps = {
    productos: productosPaginados,
    totalProducts: productosFiltrados.length,
    page: pageSafe,
    totalPages,
    setPage,
    soloOfertas,
    setSoloOfertas,
    search,
    setSearch,
    loadingProductos,
  };

  return (
    <>
      <div className="block md:hidden">
        <CategoriasBebidasMobile {...sharedProps} />
      </div>

      <div className="hidden md:block">
        <CategoriasBebidasDesktop {...sharedProps} />
      </div>
    </>
  );
};

export default CategoriasBebidas;