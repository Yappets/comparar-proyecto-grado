import React, { useRef, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AddressContext } from "../../context/AddressContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft,Info } from "lucide-react";
import { API_URL } from "../../config/api";

type Props = {
  direccionTexto: string;
  setDireccionTexto: (v: string) => void;
  searchResults: any[];
  loading: boolean;
  busquedaRealizada: boolean;
  manejarSeleccion: (lat: string, lon: string, direccion: string) => void;
  posicion: [number, number] | null;
  setPosicion: (pos: [number, number]) => void;
  buscarDireccion: (q: string) => void;
  limpiarBusqueda: () => void;
};


const RecenterMap = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  map.setView(position, 15);
  return null;
};

const DireccionDesktop: React.FC<Props> = ({
  direccionTexto,
  setDireccionTexto,
  searchResults,
  loading,
  busquedaRealizada,
  manejarSeleccion,
  posicion,
  setPosicion,
  buscarDireccion,
  limpiarBusqueda,
}) => {
  const salta: [number, number] = [-24.7829, -65.4232];

  const [showModal, setShowModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { setAddress } = useContext(AddressContext);
  const navigate = useNavigate();

  const handleInputChange = (value: string) => {
    setDireccionTexto(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      buscarDireccion(value);
    }, 700);
  };

  const guardarDireccion = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/user/direccion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          direccion: direccionTexto,
          lat: posicion?.[0],
          lon: posicion?.[1],
        }),
      });

      if (!res.ok) throw new Error("Error al guardar");

      if (posicion) {
        setAddress(direccionTexto, {
          lat: posicion[0],
          lon: posicion[1],
        });
      }

      console.log("📍 DIRECCIÓN GUARDADA:", direccionTexto);
      console.log("📍 COORDS GUARDADAS:", posicion);

      navigate("/home");
    } catch (error) {
      console.error("Error guardando dirección:", error);
      alert("Error al guardar dirección");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 relative flex items-center">
          {/* BOTÓN BACK */}
          <button onClick={() => navigate(-1)} className="text-black">
            <ArrowLeft size={24} />
          </button>

          {/* TEXTO CENTRADO REAL */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
            Seleccionar dirección
          </div>
        </div>
      </div>

      {/* INPUT + AYUDA */}
      <div className="w-full max-w-5xl px-4 mt-4 mb-2 relative z-30">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              value={direccionTexto}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Buscar dirección en Salta..."
              className="w-full p-4 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            {loading && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ...
              </div>
            )}
          </div>

          {/* BOTÓN DE SUGERENCIA */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
          >
           <button
            type="button"
            onClick={() => setShowHelp((prev) => !prev)}
            className="!bg-white w-14 h-14 rounded-2xl border border-gray-300 shadow-sm flex items-center justify-center hover:!bg-gray-50 transition"
            aria-label="Ayuda para seleccionar dirección"
          >
            <Info
              size={36}
              color="#111827"
              strokeWidth={2.5}
              className="shrink-0"
            />
          </button>

            {showHelp && (
              <div className="absolute right-0 top-14 z-[99999] w-64 rounded-xl bg-gray-900 px-3 py-2 text-left text-xs text-white shadow-2xl">
                <p className="font-semibold mb-1">Consejo</p>

                <p className="text-gray-200 leading-snug">
                  Podés mover el pin si no encontrás tu dirección.
                </p>

                <div className="absolute -top-1 right-5 w-3 h-3 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BUSCANDO */}
      {loading && direccionTexto.trim().length >= 3 && (
        <div className="w-full max-w-5xl px-4 mb-4">
          <div className="bg-white shadow rounded-xl p-3 text-sm text-gray-500 text-center">
            Buscando dirección...
          </div>
        </div>
      )}

      {/* RESULTADOS */}
      {!loading && busquedaRealizada && searchResults.length > 0 && (
        <div className="w-full max-w-5xl px-4 mb-4 bg-white shadow rounded-xl p-2 max-h-48 overflow-auto">
          {searchResults.map((r, i) => (
            <div
              key={i}
              onClick={() => manejarSeleccion(r.lat, r.lon, r.display_name)}
              className="p-3 hover:bg-gray-100 rounded cursor-pointer text-sm"
            >
              {r.display_name}
            </div>
          ))}
        </div>
      )}

      {/* NO RESULTADOS */}
      {!loading &&
        busquedaRealizada &&
        direccionTexto.trim().length >= 3 &&
        searchResults.length === 0 && (
          <div className="w-full max-w-5xl px-4 mb-4">
            <div className="bg-gray-50 border rounded-xl p-3 text-sm text-gray-500 text-center">
              No se encontraron resultados para esa dirección.
            </div>
          </div>
        )}

      {/* MAPA */}
      <div className="w-full max-w-5xl px-4 relative z-0">
        <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border">
          <MapContainer
            center={posicion || salta}
            zoom={15}
            className="w-full h-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <>
              <Marker
                position={posicion || salta}
                draggable={true}
                eventHandlers={{
                  dragend: async (e) => {
                    const marker = e.target;
                    const { lat, lng } = marker.getLatLng();

                    setPosicion([lat, lng]);

                    try {
                      const res = await fetch(
                        `${API_URL}/api/reverse-geocode?lat=${lat}&lon=${lng}`
                      );

                      const data = await res.json();

                      const direccion =
                        data.display_name || "Ubicación seleccionada";

                      setDireccionTexto(direccion);
                      setAddress(direccion, {
                        lat,
                        lon: lng,
                      });

                     
                      limpiarBusqueda();
                    } catch (error) {
                      console.error("Error reverse geocode:", error);
                    }
                  },
                }}
              />

              <RecenterMap position={posicion || salta} />
            </>
          </MapContainer>
        </div>
      </div>

      {/* BOTON */}
      <div className="w-full max-w-md mt-6 px-4 mb-10">
        <button
          onClick={() => setShowModal(true)}
          disabled={!posicion}
          className="w-full !bg-red-600 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50"
        >
          Confirmar ubicación
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Guardar dirección
            </h2>

            <div className="mb-4">
              <label className="text-sm text-gray-500">Dirección</label>
              <input
                value={direccionTexto}
                onChange={(e) => setDireccionTexto(e.target.value)}
                className="w-full p-3 border rounded-lg mt-1"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border py-3 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={guardarDireccion}
                className="flex-1 !bg-red-600 text-white py-3 rounded-lg"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DireccionDesktop;