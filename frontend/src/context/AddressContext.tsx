import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface Coords {
  lat: number;
  lon: number;
}

interface AddressContextType {
  address: string | null;
  coords: Coords | null;
  setAddress: (addr: string, coords?: Coords) => void;
  clearAddress: () => void;
}

export const AddressContext = createContext<AddressContextType>({
  address: null,
  coords: null,
  setAddress: () => {},
  clearAddress: () => {},
});

export const AddressProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [address, setAddressState] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);

  //  CARGAR DESDE LOCALSTORAGE
  useEffect(() => {
    const data = localStorage.getItem("direccion_usuario");

    if (data) {
      try {
        const parsed = JSON.parse(data);

        if (parsed?.direccion) {
          setAddressState(parsed.direccion);
        }

        if (parsed?.posicion) {
          setCoords({
            lat: parsed.posicion[0],
            lon: parsed.posicion[1],
          });
        }
      } catch (e) {
        console.error("Error leyendo dirección:", e);
      }
    }
  }, []);

  //  SETEAR + GUARDAR
  const setAddress = (addr: string, coords?: Coords) => {
    setAddressState(addr);

    if (coords) {
      setCoords(coords);
    }

    localStorage.setItem(
      "direccion_usuario",
      JSON.stringify({
        direccion: addr,
        posicion: coords
          ? [coords.lat, coords.lon]
          : null,
      })
    );
  };

  //  LIMPIAR
  const clearAddress = () => {
    setAddressState(null);
    setCoords(null);
    localStorage.removeItem("direccion_usuario");
  };

  return (
    <AddressContext.Provider
      value={{ address, coords, setAddress, clearAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
};