// Production entrypoint: starts the bundled Astro SSR server.
//
// Installs explicit SIGTERM/SIGINT handlers first. A process running as PID 1
// (as in a container) ignores signals that keep their default disposition —
// @astrojs/node registers no shutdown handlers — so without these the
// container would hang on `docker stop` until SIGKILL. Exiting matches the
// default non-PID-1 behavior.
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    process.exit(0);
  });
}

await import("./dist/server/bundle.mjs");
