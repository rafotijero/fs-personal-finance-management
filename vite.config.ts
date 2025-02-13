import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Define el puerto dinámico de Render o usa 5173 en local
const port = process.env.PORT ? parseInt(process.env.PORT) : 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: port, // Usa el puerto dinámico de Render o 5173 en local
    cors: true, // ✅ Habilita CORS en local
  },
  preview: {
    port: 4173, // 🔥 Define un puerto explícito para preview en Render
    host: "0.0.0.0",
    allowedHosts: ["fs-personal-finance-management.onrender.com"], // 🔥 Asegura que Render lo reconozca
  },
});
