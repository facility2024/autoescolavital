# syntax=docker/dockerfile:1

# ---------- build stage ----------
FROM oven/bun:1 AS build
WORKDIR /app

# Dependencies first, so this layer is reused while only source files change.
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

COPY . .

# The site's photos are Lovable Assets served from lovable.app. Copy them into
# public/ so the image stands on its own. Point ASSET_BASE at another host with:
#   docker build --build-arg ASSET_BASE=https://autoescolavital.lovable.app .
ARG ASSET_BASE=https://autoescolavital.lovable.app
ENV ASSET_BASE=${ASSET_BASE}
RUN node scripts/fetch-assets.mjs

# Build the SSR server for plain Node. (Lovable's own deploy targets Cloudflare,
# which is why vite.config.ts stays untouched and the preset comes from here.)
ENV NITRO_PRESET=node-server
RUN bun run build

# ---------- runtime stage ----------
FROM node:22-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=build /app/.output ./

EXPOSE 3000
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/index.mjs"]
