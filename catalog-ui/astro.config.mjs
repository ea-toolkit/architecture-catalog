import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  server: { port: 4321 },
  vite: {
    optimizeDeps: {
      include: ['dagre'],
    },
  },
});