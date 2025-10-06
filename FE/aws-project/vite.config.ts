import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 5173,
    fs: {
      allow: ["./", "./client", "./shared"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [
    react(),
    // Express plugin - simplified
    ...(process.env.NODE_ENV !== 'production' ? [{
      name: "express-dev-server",
      configureServer(server: any) {
        server.middlewares.use('/api', async (req: any, res: any, next: any) => {
          try {
            const { createServer } = await import("./server/index.js");
            const app = createServer();
            app(req, res, next);
          } catch (error) {
            console.error('Express server error:', error);
            next();
          }
        });
      },
    }] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  optimizeDeps: {
    include: ['antd'],
  },
});
