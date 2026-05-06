// src/App.tsx
import React from 'react';
import './App.css'; // Si tienes estilos globales
import RoutesComponent from './Routes'; // Importa el archivo de rutas

function App() {
  return (
    <div className="App">
      <RoutesComponent /> {/* El componente que maneja las rutas */}
    </div>
  );
}

export default App;
