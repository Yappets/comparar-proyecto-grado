import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPencilAlt } from "react-icons/fa";
import { AddressContext } from "../../context/AddressContext";

interface LocationState {
  direccion?: string;
  posicion?: [number, number];
}

const FormularioDireccion: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // recibimos opcionalmente la dirección desde /mapa
  const { direccion: fromMap, posicion } = (location.state as LocationState) || {};
  const { setAddress } = useContext(AddressContext);

  // Campos de formulario
  const [direccionTexto, setDireccionTexto] = useState(fromMap || "");
  const [pisoDepto, setPisoDepto] = useState("");
  const [tipo, setTipo] = useState<"Casa" | "Trabajo" | "Otro" | null>(null);
  const [otroTexto, setOtroTexto] = useState("");

  // Si viene de mapa, precargamos
  useEffect(() => {
    if (fromMap) setDireccionTexto(fromMap);
  }, [fromMap]);

  const handleGuardar = () => {
    const etiqueta = tipo === "Otro" ? otroTexto.trim() : tipo;
    // guardamos solo la dirección textual en el contexto
    setAddress(direccionTexto.trim());
    // podrías también almacenar pisoDepto/etiqueta si añades al context
    navigate("/home");
  };

  const handleVolver = () => navigate(-1);
  const handleEnOtroMomento = () => navigate("/home");

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* Header fijo */}
      <div className="flex items-center px-4 py-3 shadow-md fixed top-0 left-0 right-0 bg-white z-20">
        <button onClick={handleVolver} className="p-1 mr-4">
          <FaArrowLeft className="text-xl" />
        </button>
        <div className="flex-1 text-center text-lg font-semibold text-black">
          Detalles de la dirección
        </div>
      </div>

      {/* Contenido scrollable */}
      <main className="flex-1 overflow-y-auto pt-16 px-6 pb-32">
        {/* Dirección */}
        <div className="mb-6">
          <label className="block text-base font-medium text-gray-800 mb-2">
            Dirección
          </label>
          <input
            type="text"
            value={direccionTexto}
            onChange={(e) => setDireccionTexto(e.target.value)}
            placeholder="Selecciona en el mapa"
            className="w-full p-4 bg-gray-100 rounded-xl text-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Piso / Departamento */}
        <div className="mb-6">
          <label className="block text-base font-medium text-gray-800 mb-2">
            Piso/Departamento
          </label>
          <input
            type="text"
            value={pisoDepto}
            onChange={(e) => setPisoDepto(e.target.value)}
            placeholder="Ej. 3A"
            className="w-full p-4 bg-gray-100 rounded-xl text-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Nombre de la dirección */}
        <div className="mb-4">
          <p className="text-base font-medium text-gray-800 mb-2">
            ¿Qué nombre le damos a esta dirección?
          </p>
          <div className="flex flex-wrap gap-3">
            {(["Casa", "Trabajo"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setTipo(opt);
                  setOtroTexto("");
                }}
                className={`px-5 py-2 rounded-full text-base font-medium shadow-sm transition ${
                  tipo === opt ? "bg-red-600 text-white" : "bg-white text-gray-800"
                }`}
              >
                {opt}
              </button>
            ))}
            <button
              onClick={() => setTipo("Otro")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-base font-medium shadow-sm transition ${
                tipo === "Otro" ? "bg-red-600 text-white" : "bg-white text-gray-800"
              }`}
            >
              Otro <FaPencilAlt className="text-md" />
            </button>
          </div>
          {tipo === "Otro" && (
            <div className="mt-4">
              <input
                type="text"
                value={otroTexto}
                onChange={(e) => setOtroTexto(e.target.value)}
                placeholder="Escribe un nombre"
                className="w-full p-4 bg-gray-100 rounded-xl text-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer fijo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 shadow-inner">
        <button
          onClick={handleGuardar}
          className="w-full py-4 !bg-red-600 text-white rounded-xl text-lg font-semibold mb-2"
        >
          Guardar Dirección
        </button>
        <button
          onClick={handleEnOtroMomento}
          className="w-full py-2 text-center text-black bg-white rounded-xl font-medium"
        >
          En otro momento
        </button>
      </div>
    </div>
  );
};

export default FormularioDireccion;
