import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Define el puerto dinámico de Render o usa 5173 en local
const port = process.env.PORT ? parseInt(process.env.PORT) : 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: port, // 🔥 Usa el puerto dinámico de Render o 5173 en local
    cors: true, // ✅ Habilita CORS en el entorno local
  },
  preview: {
    host: "0.0.0.0",
    port: 4173, // 🔥 Define un puerto explícito para preview en Render
    allowedHosts: [
      "fs-personal-finance-management.onrender.com", // 🔥 Permite el frontend en Render
      "bs-personal-finance-management.onrender.com"  // 🔥 También el backend en Render
    ],
  },
});
