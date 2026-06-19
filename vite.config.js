// vite.config.js — BUILD CONFIGURATION
// Vite is the build tool that bundles our app. Plugins extend what it can do.
// We add two plugins:
//   1. react()       — lets Vite understand JSX syntax
//   2. tailwindcss() — processes Tailwind classes and generates the final CSS

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// #region agent log
function debugLogPlugin() {
  const logPath = path.resolve(process.cwd(), '.cursor/debug-83596e.log');
  return {
    name: 'debug-log-ingest',
    configureServer(server) {
      server.middlewares.use('/__debug/log', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
          try {
            fs.mkdirSync(path.dirname(logPath), { recursive: true });
            fs.appendFileSync(logPath, body.trim() + '\n');
          } catch {
            // ignore write failures
          }
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}
// #endregion

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // Scans your JSX for Tailwind classes and builds only the CSS you actually use
    debugLogPlugin(),
  ],
  root: 'src',
  server: {
    strictPort: true,
  },
});
