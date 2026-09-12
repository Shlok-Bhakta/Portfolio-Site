# syntax=docker/dockerfile:1
#
# Portfolio site — Bun multi-stage build.
#
# The SSR server (Astro @astrojs/node standalone) is bundled with Bun into a
# single file (`dist/server/bundle.mjs`) plus the static `dist/client/`
# assets, and served with the Bun runtime. A fully self-contained
# `bun build --compile` binary was tried first, but @astrojs/node locates its
# client assets by walking up from import.meta.url looking for a "server"
# folder, and Bun exposes a virtual /$bunfs/... URL inside compiled binaries,
# so the compiled binary crashes on startup. The single-file bundle keeps the
# real on-disk path (dist/server/) and starts cleanly.
# The runtime stage is oven/bun:distroless, which is itself a from-scratch
# image containing only Bun, glibc and CA certificates — no node_modules
# needed at runtime since everything is bundled.

FROM docker.io/oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build
RUN bun run bundle


FROM docker.io/oven/bun:distroless AS runtime
WORKDIR /app

COPY --from=build /app/dist/client ./dist/client
COPY --from=build /app/dist/server/bundle.mjs ./dist/server/bundle.mjs
COPY --from=build /app/serve.mjs ./serve.mjs

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production
EXPOSE 4321

ENTRYPOINT ["bun", "./serve.mjs"]
