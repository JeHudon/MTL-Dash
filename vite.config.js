import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
    plugins: [
        react(), 
        process.env.IS_DOCKER ? null : cloudflare()
    ].filter(Boolean),
    server: {
        proxy: {
            "/api": {
                target: "https://api-web.nhle.com/v1",
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
    preview: {
        proxy: {
            "/api": {
                target: "https://api-web.nhle.com/v1",
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
