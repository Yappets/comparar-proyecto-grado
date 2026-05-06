import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AddressContext } from "../../context/AddressContext";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "../../config/api";

type Direccion = {
  id: number;
  direccion: string;
  posicion?: [number, number];
};

const DireccionesGuardadas: React.FC = () => {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const navigate = useNavigate();
  const { setAddress } = useContext(AddressContext);

  useEffect(() => {
    const fetchDirecciones = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/user/direcciones`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("📦 DIRECCIONES BACK:", data);

        // 🔥 FIX CLAVE: mapear lat/lon → posicion
        const direccionesFormateadas = data.map((d: any, index: number) => ({
          id: index,
          direccion: d.direccion,
          posicion: d.lat && d.lon ? [d.lat, d.lon] : undefined,
        }));

        console.log("📦 DIRECCIONES FRONT:", direccionesFormateadas);

        setDirecciones(direccionesFormateadas);

      } catch (error) {
        console.error("Error cargando direcciones:", error);
      }
    };

    fetchDirecciones();
  }, []);

  const seleccionarDireccion = (dir: Direccion) => {
    console.log("🧠 DIRECCIÓN CLICKEADA:", dir);

    if (dir.posicion) {
      const coords = {
        lat: dir.posicion[0],
        lon: dir.posicion[1],
      };

      console.log(" SETEANDO COORDS:", coords);

      setAddress(dir.direccion, coords);
    } else {
      console.log(" NO HAY COORDS");
      setAddress(dir.direccion);
    }

    navigate("/home");
  };

  return (
  <div className="min-h-screen bg-white">

    {/* ================= HEADER ================= */}
   <div className="px-4 py-4 bg-white shadow-sm sticky top-0 z-20">
    <div className="relative flex items-center">

      {/* BOTÓN BACK */}
      <button
        onClick={() => navigate(-1)}
        className="text-black"
      >
        <ArrowLeft size={24} />
      </button>

      {/* TÍTULO CENTRADO REAL */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
        Mis direcciones
      </div>

    </div>
  </div>

    {/* ================= CONTENIDO ================= */}
    <div className="pt-[90px] p-6 max-w-3xl mx-auto">

      <div className="space-y-3">

        {direcciones.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No tenés direcciones guardadas
          </div>
        )}

        {direcciones.map((dir) => (
          <div
            key={dir.id}
            className="p-4 border rounded-xl flex justify-between items-center hover:shadow-sm transition"
          >
            <span className="text-sm">
              {dir.direccion}
            </span>

            <button
              onClick={() => seleccionarDireccion(dir)}
              className="text-blue-600 font-medium hover:underline"
            >
              Usar
            </button>
          </div>
        ))}

      </div>

      <button
        onClick={() => navigate("/direccion")}
        className="w-full mt-6 !bg-red-600 text-white py-3 rounded-xl font-semibold"
      >
        Agregar nueva dirección
      </button>

    </div>
  </div>
);
};

export default DireccionesGuardadas;