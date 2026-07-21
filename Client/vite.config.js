import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": { target: "http://localhost:5000", bypass: spaBypass },
      "/employee": { target: "http://localhost:5000", bypass: spaBypass },
      "/department": { target: "http://localhost:5000", bypass: spaBypass },
      "/room": { target: "http://localhost:5000", bypass: spaBypass },
      "/booking": { target: "http://localhost:5000", bypass: spaBypass },
      "/upload": { target: "http://localhost:5000", bypass: spaBypass },
      "/uploads": { target: "http://localhost:5000", bypass: spaBypass },
      "/price-room": { target: "http://localhost:5000", bypass: spaBypass },
      "/price-holiday": { target: "http://localhost:5000", bypass: spaBypass },
    },
  },
});

function spaBypass(req) {
  if (req.headers.accept?.includes("text/html")) {
    return "/index.html";
  }
}
