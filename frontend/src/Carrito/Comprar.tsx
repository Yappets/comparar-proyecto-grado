import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AddressContext } from "../context/AddressContext";
import { calcularTotalConPromocion } from "../Carrito/CalcularPromocion";
import { API_URL } from "../config/api";

/* ================= TIPOS ================= */

type ProductoDetalle = {
  nombre: string;
  titulo: string;
  supermercado: string;
  imagen: string;
  precio_base: number;
  oferta_texto: string;
  promocion: any | null;
  link: string;
};


const getEstadoPromocion = (item: any, producto: any) => {
  if (!producto?.promocion) return null;

  const promo = producto.promocion;

  if (promo.tipo === "BLOQUE_DESCUENTO") {
    const descuento = promo.estructura[1]?.descuento || 0;
    const necesario = promo.cantidadBloque;

    if (item.cantidad < necesario) {
      return {
        tipo: "faltante",
        mensaje: `Agregá ${necesario - item.cantidad} más para 2do al ${descuento}%`,
      };
    }

    return {
      tipo: "aplicada",
      mensaje: `2do al ${descuento}% aplicada`,
    };
  }

  if (promo.tipo === "N_X_M") {
    const n = promo.cantidadBloque;
    const m = promo.estructura[0]?.unidades;

    if (item.cantidad < n) {
      return {
        tipo: "faltante",
        mensaje: `Agregá ${n - item.cantidad} más para ${n}x${m}`,
      };
    }

    return {
      tipo: "aplicada",
      mensaje: `Promo ${n}x${m} aplicada`,
    };
  }

  if (promo.tipo === "DESCUENTO_UNITARIO") {
    const descuento = promo.estructura[0]?.descuento || 0;

    return {
      tipo: "aplicada",
      mensaje: `${descuento}% OFF aplicado`,
    };
  }

  return null;
};



/* ================= COMPONENTE ================= */

const Comprar: React.FC = () => {
  const {
    items,
    supermercadoSeleccionado,
    setSupermercadoSeleccionado,
    setTotalSeleccionado,
  } = useCart();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [disponibilidad, setDisponibilidad] = useState<any[]>([]);
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});
  const [usuarioSelecciono, setUsuarioSelecciono] = useState(false);
  const [distancias, setDistancias] = useState<any[]>([]);

  const { coords } = useContext(AddressContext);

  /* ================= FETCH DISPONIBILIDAD (IGUAL QUE DETALLE) ================= */

 useEffect(() => {
  const fetchDisponibilidad = async () => {
    try {
      setLoading(true);

      const resultados = await Promise.all(
        items.map(async (item) => {
          const res = await fetch(`${API_URL}/api/productos/detalle/${encodeURIComponent(item.nombre)}`);
          const data = await res.json();

          return {
            nombre: item.nombre,
            cantidad: item.cantidad,
            opciones: data,
          };
        })
      );

      setDisponibilidad(resultados);
    } catch (error) {
      console.error("Error cargando disponibilidad", error);
    } finally {
      setLoading(false); 
    }
  };

  if (items.length > 0) {
    fetchDisponibilidad();
  } else {
    setDisponibilidad([]);
    setLoading(false); // si carrito vacío
  }
}, [items]);

  /* ================= FETCH DISTANCIAS ================= */

  useEffect(() => {
    if (!coords) return;

    const fetchDistancias = async () => {
      try {
        const res = await fetch(`${API_URL}/api/supermercados/distancias?lat=${coords.lat}&lon=${coords.lon}`);

        const data = await res.json();
        setDistancias(data);
      } catch (error) {
        console.error("Error obteniendo distancias:", error);
      }
    };

    fetchDistancias();
  }, [coords]);

  /* ================= ARMAR SUPERMERCADOS ================= */

 const supermercados = useMemo(() => {
  // LISTA FIJA
  const nombres = ["Super Vea", "Super Jumbo", "Super Dia"];

  const acc: Record<string, any[]> = {};

  // 🔥 Inicializar TODOS
  nombres.forEach((nombre) => {
    acc[nombre] = [];
  });

  //  Llenar con los que existan
  disponibilidad.forEach((item) => {
    item.opciones.forEach((op: ProductoDetalle) => {
      if (!acc[op.supermercado]) return;

      acc[op.supermercado].push({
        ...op,
        cantidad: item.cantidad,
        nombre: item.nombre,
      });
    });
  });

  return acc;
}, [disponibilidad]);

  /* ================= COMPARACIONES ================= */

  const comparaciones = useMemo(() => {
    return Object.entries(supermercados).map(
      ([supermercado, productos]) => {
        let total = 0;

        for (const item of items) {
          const encontrado = productos.find(
            (p) => p.nombre === item.nombre
          );

          if (encontrado) {
            total += calcularTotalConPromocion(
              encontrado.precio_base,
              encontrado.promocion,
              item.cantidad
            );
          }
        }

        const faltantes = items.filter(
          (item) => !productos.some((p) => p.nombre === item.nombre)
        ).length;

        return {
          supermercado,
          productos,
          total,
          faltantes,
        };
      }
    );
  }, [supermercados, items]);

  /* ================= AUTO SELECCIÓN ================= */

  useEffect(() => {
    if (usuarioSelecciono) return;

    const completos = comparaciones.filter((s) => s.faltantes === 0);

    if (completos.length > 0) {
      const mejor = completos.reduce((prev, curr) =>
        curr.total < prev.total ? curr : prev
      );

      setSupermercadoSeleccionado(mejor.supermercado);
      setTotalSeleccionado(mejor.total);
    } else {
      setSupermercadoSeleccionado("");
      setTotalSeleccionado(0);
    }
  }, [comparaciones]);

  useEffect(() => {
    const seleccionado = comparaciones.find(
      (s) => s.supermercado === supermercadoSeleccionado
    );

    if (seleccionado) {
      setTotalSeleccionado(seleccionado.total);
    }
  }, [supermercadoSeleccionado, comparaciones]);

  /* ================= HELPERS ================= */

  const toggleExpandido = (supermercado: string) => {
    setExpandido((prev) => ({
      ...prev,
      [supermercado]: !prev[supermercado],
    }));
  };

  const seleccionarSupermercado = (supermercado: string, total: number) => {
    setSupermercadoSeleccionado(supermercado);
    setUsuarioSelecciono(true);
    setTotalSeleccionado(total);
  };


if (loading) {
  return (
    <div className="space-y-4 p-4 pb-32">
      
      <div className="text-center text-gray-500 mb-2">
        Cargando precios...
      </div>

      {/* Skeleton cards */}
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-gray-200 rounded-2xl"></div>
        <div className="h-20 bg-gray-200 rounded-2xl"></div>
        <div className="h-20 bg-gray-200 rounded-2xl"></div>
      </div>

    </div>
  );
}

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6 pb-32">
      {comparaciones.map(({ supermercado, total, faltantes, productos }) => {
        const estaExpandido = expandido[supermercado] ?? false;

        return (
          <div
            key={supermercado}
            className={`rounded-3xl overflow-hidden shadow-md border ${
              supermercadoSeleccionado === supermercado
                ? "border-emerald-400 bg-emerald-50"
                : ""
            }`}
          >
            <div className="px-4 py-4 bg-white">
              <div className="flex justify-between items-center">
                <span className="font-medium">{supermercado}</span>

                <button
                  onClick={() => toggleExpandido(supermercado)}
                  className="flex items-center gap-1 font-semibold"
                >
                  <span>${total.toLocaleString()}</span>
                  {estaExpandido ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {estaExpandido && (
                <div className="mt-2 space-y-3 text-sm border-t pt-2">
                  {items.map((item) => {
                    const encontrado = productos.find(
                      (p) => p.nombre === item.nombre
                    );

                    const estadoPromo = getEstadoPromocion(item, encontrado);

                    const totalProducto = encontrado
                      ? calcularTotalConPromocion(
                          encontrado.precio_base,
                          encontrado.promocion,
                          item.cantidad
                        )
                      : 0;

                    return (
                      <div
                        key={item.nombre}
                        className="grid grid-cols-[1fr_100px] grid-rows-[auto_auto] gap-x-2 gap-y-1"
                      >
                        {/* NOMBRE */}
                        <div
                          className={`text-sm ${
                            !encontrado ? "text-red-600" : ""
                          }`}
                        >
                          {item.cantidad} x {item.nombre}
                        </div>

                        {/* PRECIO */}
                        <div className="text-right text-sm">
                          {!encontrado
                            ? "-"
                            : `$${totalProducto.toLocaleString()}`}
                        </div>

                        {/* PROMO STATUS */}
                        <div className="col-span-2 text-xs min-h-[16px]">
                          {estadoPromo && (
                            <span
                              className={
                                estadoPromo.tipo === "aplicada"
                                  ? "text-green-600"
                                  : "text-orange-500"
                              }
                            >
                              {estadoPromo.mensaje}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {faltantes > 0 && (
                <div className="mt-3 text-red-500 text-sm">
                  Falta {faltantes} producto{faltantes > 1 ? "s" : ""}
                </div>
              )}
            </div>

            <button
              onClick={() => seleccionarSupermercado(supermercado, total)}
              className="w-full py-2 bg-gray-100"
            >
              Seleccionar este supermercado
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Comprar;