import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";  // <-- añadimos useNavigate
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { API_URL } from "../../config/api";

const marcadorIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const Mapa: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();  // <-- inicializamos navigate
  const { posicion, direccion } = location.state || {
    posicion: [-34.6037, -58.3816],
    direccion: "Ubicación no disponible",
  };

  const [direccionTexto, setDireccionTexto] = useState(direccion);
  const [markerPosition, setMarkerPosition] = useState(posicion);

  // Geocodificación inversa
  const obtenerDireccion = async (lat: number, lng: number) => {
    const response = await fetch(`${API_URL}/api/reverse-geocode?lat=${lat}&lon=${lng}`);
    const data = await response.json();
    const nuevaDir = data.display_name || `Lat: ${lat}, Lon: ${lng}`;
    setDireccionTexto(nuevaDir);
  };

  // Handler de arrastre
  const handleMarkerDrag = (event: L.LeafletEvent) => {
    const { lat, lng } = event.target.getLatLng();
    setMarkerPosition([lat, lng]);
    obtenerDireccion(lat, lng);
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col h-screen bg-white">
      {/* Mapa ocupa todo el espacio restante */}
      <div className="flex-1 w-full">
        <MapContainer
          center={markerPosition}
          zoom={15}
          className="w-full h-full rounded-lg overflow-hidden"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markerPosition && (
            <Marker
              position={markerPosition}
              icon={marcadorIcon}
              draggable
              eventHandlers={{ dragend: handleMarkerDrag }}
            >
              <Popup>{direccionTexto}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Panel inferior */}
      <div className="w-full bg-white shadow-lg px-6 py-4 h-56 rounded-t-xl">
        <div className="text-center text-xl font-semibold text-black mb-4">
          Confirmar Dirección
        </div>

        <input
          type="text"
          value={direccionTexto}
          onChange={(e) => setDireccionTexto(e.target.value)}
          placeholder="Dirección o punto de referencia"
          className="w-full p-4 border border-gray-300 rounded-full text-lg shadow-sm mb-4"
        />

        <button
          onClick={() =>
            navigate("/detalles_direccion", {
              state: {
                posicion: markerPosition,
                direccion: direccionTexto,
              },
            })
          }
          className="w-full py-3 !bg-red-600 text-white rounded-xl font-semibold"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default Mapa;
