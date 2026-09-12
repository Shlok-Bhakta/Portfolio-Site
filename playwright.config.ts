import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against the single-file production server bundle
 * (`dist/server/bundle.mjs`) executed with the Bun runtime — the exact files
 * the Docker image ships. Run `bun run build && bun run bundle` first.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun ./dist/server/bundle.mjs",
    url: "http://127.0.0.1:4321/",
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: "4321",
      HOST: "127.0.0.1",
    },
    stdout: "pipe",
    stderr: "pipe",
  },
});
