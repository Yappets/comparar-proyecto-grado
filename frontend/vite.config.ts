import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Importa el plugin de Tailwind

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,    // Esto hace que escuche en 0.0.0.0 (todas las interfaces)
    port: 5173,    // Opcional: puedes definir el puerto si quieres
  },
})
