import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
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

  // Evita que respuestas viejas pisen el resultado si el carrito cambia mientras se está calculando.
  const requestIdRef = useRef(0);

  // Clave del carrito actual: cambia si cambia el producto o la cantidad.
  const carritoKey = useMemo(() => {
    return items
      .map((item) => `${item.nombre}-${item.cantidad}`)
      .join("|");
  }, [items]);

  /* ================= FETCH DISPONIBILIDAD ================= */

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      const requestId = ++requestIdRef.current;

      if (items.length === 0) {
        setDisponibilidad([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const resultados = await Promise.all(
          items.map(async (item) => {
            try {
              const res = await fetch(
                `${API_URL}/api/productos/detalle/${encodeURIComponent(
                  item.nombre
                )}`
              );

              if (!res.ok) {
                throw new Error(`Error HTTP ${res.status}`);
              }

              const data = await res.json();

              return {
                nombre: item.nombre,
                cantidad: item.cantidad,
                opciones: Array.isArray(data) ? data : [],
              };
            } catch (error) {
              console.error("Error cargando disponibilidad de:", item.nombre, error);

              return {
                nombre: item.nombre,
                cantidad: item.cantidad,
                opciones: [],
              };
            }
          })
        );

        // Solo se actualiza si esta sigue siendo la última búsqueda activa.
        if (requestIdRef.current === requestId) {
          setDisponibilidad(resultados);
        }
      } catch (error) {
        console.error("Error cargando disponibilidad", error);

        if (requestIdRef.current === requestId) {
          setDisponibilidad([]);
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false);
        }
      }
    };

    fetchDisponibilidad();
  }, [carritoKey]);

  /* ================= VALIDAR SI LA DISPONIBILIDAD YA CORRESPONDE AL CARRITO ACTUAL ================= */

  const disponibilidadCompleta = useMemo(() => {
    if (items.length === 0) return true;
    if (disponibilidad.length !== items.length) return false;

    return items.every((item) =>
      disponibilidad.some(
        (d) => d.nombre === item.nombre && d.cantidad === item.cantidad
      )
    );
  }, [items, disponibilidad]);

  const procesando = loading || !disponibilidadCompleta;

  /* ================= FETCH DISTANCIAS ================= */

  useEffect(() => {
    if (!coords) return;

    const fetchDistancias = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/supermercados/distancias?lat=${coords.lat}&lon=${coords.lon}`
        );

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
    const nombres = ["Super Vea", "Super Jumbo", "Super Dia"];

    const acc: Record<string, any[]> = {};

    nombres.forEach((nombre) => {
      acc[nombre] = [];
    });

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
    return Object.entries(supermercados).map(([supermercado, productos]) => {
      let total = 0;

      for (const item of items) {
        const encontrado = productos.find((p) => p.nombre === item.nombre);

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
    });
  }, [supermercados, items]);

  /* ================= AUTO SELECCIÓN ================= */

  useEffect(() => {
    if (procesando) return;
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
  }, [
    procesando,
    usuarioSelecciono,
    comparaciones,
    setSupermercadoSeleccionado,
    setTotalSeleccionado,
  ]);

  useEffect(() => {
    if (procesando) return;

    const seleccionado = comparaciones.find(
      (s) => s.supermercado === supermercadoSeleccionado
    );

    if (seleccionado) {
      setTotalSeleccionado(seleccionado.total);
    }
  }, [
    procesando,
    supermercadoSeleccionado,
    comparaciones,
    setTotalSeleccionado,
  ]);

  /* ================= HELPERS ================= */

  const toggleExpandido = (supermercado: string) => {
    setExpandido((prev) => ({
      ...prev,
      [supermercado]: !prev[supermercado],
    }));
  };

  const seleccionarSupermercado = (supermercado: string, total: number) => {
    if (procesando) return;

    setSupermercadoSeleccionado(supermercado);
    setUsuarioSelecciono(true);
    setTotalSeleccionado(total);
  };

  if (procesando) {
    return (
      <div className="space-y-4 p-4 pb-32">
        <div className="text-center text-gray-500 mb-2">
          Calculando disponibilidad y precios...
        </div>

        <div className="animate-pulse space-y-4">
          <div className="h-28 bg-gray-200 rounded-3xl"></div>
          <div className="h-28 bg-gray-200 rounded-3xl"></div>
          <div className="h-28 bg-gray-200 rounded-3xl"></div>
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
                        <div
                          className={`text-sm ${
                            !encontrado ? "text-red-600" : ""
                          }`}
                        >
                          {item.cantidad} x {item.nombre}
                        </div>

                        <div className="text-right text-sm">
                          {!encontrado
                            ? "-"
                            : `$${totalProducto.toLocaleString()}`}
                        </div>

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
              disabled={procesando}
              className="w-full py-2 bg-gray-100 disabled:opacity-50"
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