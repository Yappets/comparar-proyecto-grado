import React, { useState, useContext } from "react";
import DireccionDesktop from "./DireccionDesktop";
import { AddressContext } from "../../context/AddressContext";
import { API_URL } from "../../config/api";

const Direccion: React.FC = () => {
  const [direccionTexto, setDireccionTexto] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [posicion, setPosicion] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);


  const [busquedaRealizada, setBusquedaRealizada] = useState(false);


  const { setAddress } = useContext(AddressContext);

  const buscarDireccion = async (direccion: string) => {
    const query = direccion.trim();

    if (query.length < 3) {
      setSearchResults([]);
      setBusquedaRealizada(false);
      return;
    }

    setLoading(true);
    setSearchResults([]);
    setBusquedaRealizada(true);

    try {
      const res = await fetch(
        `${API_URL}/api/search?q=${encodeURIComponent(query)}`
      );

      const data = await res.json();

      console.log("RESULTADOS:", data);

      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("ERROR BUSQUEDA:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const manejarSeleccion = (lat: string, lon: string, direccion: string) => {
    const coords = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    };

    setPosicion([coords.lat, coords.lon]);
    setDireccionTexto(direccion);


    setAddress(direccion, coords);

    console.log("📍 DIRECCIÓN GUARDADA:", direccion);
    console.log("📍 COORDS GUARDADAS:", coords);

    setSearchResults([]);
    setBusquedaRealizada(false);
  };


  const limpiarBusqueda = () => {
    setSearchResults([]);
    setBusquedaRealizada(false);
  };

  return (
    <DireccionDesktop
      direccionTexto={direccionTexto}
      setDireccionTexto={setDireccionTexto}
      searchResults={searchResults}
      loading={loading}
      busquedaRealizada={busquedaRealizada}
      manejarSeleccion={manejarSeleccion}
      posicion={posicion}
      setPosicion={setPosicion}
      buscarDireccion={buscarDireccion}
      limpiarBusqueda={limpiarBusqueda}
    />
  );
};

export default Direccion;