// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import the new v4 compiler plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add it directly to your Vite build stream
  ],
});