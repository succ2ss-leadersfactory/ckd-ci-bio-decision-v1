import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        instructorLive: resolve(__dirname, 'instructor-live.html'),
        journey: resolve(__dirname, 'journey.html'),
        journeyV35Preview: resolve(__dirname, 'journey-v35-preview.html'),
        journeyV36Preview: resolve(__dirname, 'journey-v36-preview.html'),
        journeyV37Preview: resolve(__dirname, 'journey-v37-preview.html'),
        journeyV38Preview: resolve(__dirname, 'journey-v38-preview.html')
      }
    }
  }
});
