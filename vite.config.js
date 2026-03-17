import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
    plugins: [react(), cloudflare()],
    server: {
        proxy: {
            "/api": {
                target: "https://api-web.nhle.com/v1",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
