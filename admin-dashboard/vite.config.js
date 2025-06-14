import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Optional: set a default port for the dev server
    proxy: {
      // Proxying API requests from /api/v1 to http://localhost:8080/api/v1
      '/api/v1': {
        target: 'http://localhost:8080', // Your backend server
        changeOrigin: true, // Needed for virtual hosted sites
        // secure: false, // Uncomment if your backend is not using HTTPS (common for local dev)
        // rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1'), // Usually not needed if target includes the path prefix as well, but good for clarity
                                                                    // In this case, target is just the host, so the path is appended as is.
      },
    },
  },
});
