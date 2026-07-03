import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Multi-page static build — every top-level .html is an entry.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        outreach: resolve(import.meta.dirname, 'outreach.html'),
        resources: resolve(import.meta.dirname, 'resources.html'),
        sponsors: resolve(import.meta.dirname, 'sponsors.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        notfound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
});
