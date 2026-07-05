# syntax=docker/dockerfile:1.7
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV CI=1

# ---- deps (all deps, for building) ----
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --no-audit --no-fund

# ---- build ----
FROM dependencies AS build
COPY --link . .
ENV NODE_ENV=production
# Build-time heap cap (only used during build)
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# ---- development ----
FROM base AS development
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --no-audit --no-fund
COPY --link . .
CMD [ "npm", "run", "dev" ]

# ---- production runtime (no dev deps, no source) ----
FROM base AS production
ARG PORT=3000
ENV PORT=$PORT
ENV NODE_ENV=production
# Runtime heap cap — small SSR app doesn't need 4 GB
ENV NODE_OPTIONS="--max-old-space-size=512"

# Nuxt's .output is self-contained (Nitro bundles deps).
# You do NOT need node_modules, package.json or lockfile at runtime.
COPY --from=build /app/.output /app/.output

USER node
EXPOSE $PORT
CMD ["node", ".output/server/index.mjs"]
