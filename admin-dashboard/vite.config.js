import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Standard port for React apps, can be changed
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8080', // Your backend API
        changeOrigin: true,
        // secure: false, // If your backend is HTTP
        // rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1'), // Usually not needed if target has no path or same path
      },
    },
  },
});
