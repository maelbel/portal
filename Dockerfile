FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV CI=1
RUN corepack enable

# ---- dependencies ----
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---- build ----
FROM dependencies AS build
COPY --link . .
RUN test -f app/services.config.ts || cp app/services.config.example.ts app/services.config.ts
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN pnpm run build

# ---- development ----
FROM base AS development
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
COPY --link . .
RUN test -f app/services.config.ts || cp app/services.config.example.ts app/services.config.ts
CMD [ "pnpm", "run", "dev" ]

# ---- production ----
FROM base AS production
ARG PORT=3000
ENV PORT=$PORT
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

COPY --from=build /app/.output /app/.output

USER node
EXPOSE $PORT
CMD ["node", ".output/server/index.mjs"]
