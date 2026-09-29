# syntax=docker/dockerfile:1
#
# Build Astro with Bun, then run its Node-targeted bundle with Node 22.
# The server's VM does not expose AVX and Bun crashes there even on a
# one-line script. The bundle keeps Astro's server/client paths on disk.

FROM docker.io/oven/bun:1.3.14 AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build
RUN bun run bundle


FROM docker.io/library/node:22-alpine AS runtime
WORKDIR /app

COPY --from=build /app/dist/client ./dist/client
COPY --from=build /app/dist/server/bundle.mjs ./dist/server/bundle.mjs
COPY --from=build /app/serve.mjs ./serve.mjs

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production
EXPOSE 4321

ENTRYPOINT ["node", "./serve.mjs"]
