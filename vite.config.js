import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import url from 'url';

/**
 * Custom Vite plugin to handle /api/* endpoints during local development
 * without needing a separate backend server or port.
 */
function apiDevPlugin() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next();
        }

        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        let handlerModule = null;
        if (pathname === '/api/health' || pathname === '/api/health.js') {
          handlerModule = await server.ssrLoadModule('./api/health.js');
        } else if (pathname === '/api/presets' || pathname === '/api/presets.js') {
          handlerModule = await server.ssrLoadModule('./api/presets.js');
        } else if (pathname === '/api/audit' || pathname === '/api/audit.js') {
          handlerModule = await server.ssrLoadModule('./api/audit.js');
        } else if (pathname === '/api/simulate' || pathname === '/api/simulate.js') {
          handlerModule = await server.ssrLoadModule('./api/simulate.js');
        } else if (pathname === '/api/location-intel' || pathname === '/api/location-intel.js') {
          handlerModule = await server.ssrLoadModule('./api/location-intel.js');
        }

        if (!handlerModule || !handlerModule.default) {
          return next();
        }

        // Attach query
        req.query = parsedUrl.query;

        // Buffer body if POST / PUT
        if (req.method === 'POST' || req.method === 'PUT') {
          let bodyData = '';
          req.on('data', chunk => { bodyData += chunk; });
          req.on('end', async () => {
            try {
              req.body = bodyData ? JSON.parse(bodyData) : {};
            } catch {
              req.body = {};
            }

            // Mock Express-like response helpers for serverless handler
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            try {
              await handlerModule.default(req, res);
            } catch (err) {
              console.error('[neev-dev-api] Error in handler:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          // GET requests
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };

          try {
            await handlerModule.default(req, res);
          } catch (err) {
            console.error('[neev-dev-api] Error in handler:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  resolve: {
    alias: {
      '@shared': resolve(__dirname, './shared'),
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
