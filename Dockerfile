FROM node:22-alpine AS base

WORKDIR /app

FROM base AS dependencies

COPY package.json pnpm-lock.yaml ./
RUN npm i

FROM dependencies AS build

COPY --link . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

FROM base AS development

COPY --from=dependencies /app/node_modules /app/node_modules

CMD [ "npm", "run", "dev" ]

FROM base AS production

ARG PORT=3000
ENV PORT=$PORT
ENV NODE_ENV=production

COPY --from=build /app/.output /app/.output
COPY --from=build /app/package.json package.json
COPY --from=build /app/package-lock.json package-lock.json

CMD [ "node", ".output/server/index.mjs" ]
