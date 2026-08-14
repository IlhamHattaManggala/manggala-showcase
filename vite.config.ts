import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@manggala31/react-spotlight': path.resolve(__dirname, './src/packages/react-spotlight'),
      '@manggala31/react-dashboard-grid': path.resolve(__dirname, './src/packages/react-dashboard-grid'),
      '@manggala31/react-datatable': path.resolve(__dirname, './src/packages/react-datatable'),
      '@manggala31/react-status-page': path.resolve(__dirname, './src/packages/react-status-page'),
      '@manggala31/schema-form-react': path.resolve(__dirname, './src/packages/schema-form-react'),
    },
  },
});
