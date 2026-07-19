import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:5000",
      "/employee": "http://localhost:5000",
      "/department": "http://localhost:5000",
      "/room": "http://localhost:5000",
      "/booking": "http://localhost:5000",
    },
  },
});
