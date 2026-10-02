import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const freeserpProxy = {
  '/api/freeserp': {
    target: 'https://freeserp.ai',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api\/freeserp/, '/api.php'),
  },
};

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: { proxy: freeserpProxy },
  preview: { proxy: freeserpProxy },
});
