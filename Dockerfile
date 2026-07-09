FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV CI=1

# ---- dependencies ----
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --no-audit --no-fund

# ---- build ----
FROM dependencies AS build
COPY --link . .
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# ---- development ----
FROM base AS development
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --no-audit --no-fund
COPY --link . .
CMD [ "npm", "run", "dev" ]

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
