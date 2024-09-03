import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";


// Custom Vite plugin to add headers to specific routes
const addHeadersToRoute = (route) => ({
  name: 'add-headers-to-route',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.startsWith(route)) {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      }
      next();
    });
  }
});

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [sitemap(), svelte(), tailwind()],
  vite: {
    plugins: [addHeadersToRoute('/Spread-The-Light')]
  }
});