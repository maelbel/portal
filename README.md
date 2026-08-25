# Portal

A personal homelab dashboard — a single page listing self-hosted services with search and
tag filtering. Built with [Nuxt 4](https://nuxt.com) and [Nuxt UI](https://ui.nuxt.com).

Runs behind [Traefik](https://traefik.io) on the internal network, not exposed publicly.

## How it works

Services are plain data, not a database: `app/services.config.ts` is a hardcoded list
(label, URL, container names, tags). Adding, editing, or removing a service means editing
that file and redeploying — no API, no backend.

That file is gitignored so real hostnames never leave the machine it runs on. Copy the example
to get started:

```bash
cp app/services.config.example.ts app/services.config.ts
```

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Or via Docker Compose:

```bash
docker compose up
```

Served on `http://localhost:3000`.

## Production

```bash
pnpm build
pnpm preview
```

The `docker-compose.yml` builds the `production` image target and serves the compiled output —
no source is mounted at runtime.

## Scripts

- `pnpm lint` — ESLint
- `pnpm typecheck` — Nuxt/Vue type checking
- `pnpm build` / `pnpm preview` — production build and preview
