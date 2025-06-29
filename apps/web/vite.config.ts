import type { IncomingMessage, ServerResponse } from 'node:http';
import { reactRouter } from '@react-router/dev/vite';
import type { ViteDevServer } from 'vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
// import devtoolsJson from 'vite-plugin-devtools-json'; // Alternative approach

export default defineConfig({
  plugins: [
    // Option 1: Manual Chrome DevTools configuration (current approach)
    {
      name: 'handle-chrome-devtools',
      configureServer(server: ViteDevServer) {
        server.middlewares.use(
          '/.well-known/appspecific/com.chrome.devtools.json',
          (_req: IncomingMessage, res: ServerResponse) => {
            // Chrome DevTools Workspace configuration
            // This enables automatic workspace folder connection in DevTools
            // allowing you to save changes made in DevTools directly to source files
            const devToolsConfig = {
              workspace: {
                // Random UUID for this project - keeps workspace connection stable
                uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                // Absolute path to project root for file mapping
                root: process.cwd(),
              },
            };

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(devToolsConfig, null, 2));
          },
        );
      },
    },

    // Option 2: Official plugin (uncomment to use instead)
    // devtoolsJson({
    //   uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' // Optional: specify UUID
    // }),

    reactRouter(),
    tsconfigPaths(),
    // Biome override disabled for this line - type conflict between Vite plugin versions
    // biome-ignore lint/suspicious/noExplicitAny: legitimate plugin type conflict
  ] as any,
});
