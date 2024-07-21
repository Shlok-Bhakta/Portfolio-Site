import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [sitemap(), svelte(), tailwind()],
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});