# Portal

A personal homelab launcher — a single page of self-hosted services grouped by category, with
an inline filter and a <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> command palette to jump straight to one. Built with [Nuxt 4](https://nuxt.com) and [Nuxt UI](https://ui.nuxt.com).

Runs behind [Traefik](https://traefik.io) on the internal network, not exposed publicly.

## How it works

Services are plain data, not a database: `app/services.config.ts` is a hardcoded list
(label, URL, icon, container names, tags). Adding, editing, or removing a service means editing
that file and redeploying — no API, no backend.

- **Groups** come from tags: the first tag that isn't `internal`/`external` is the category.
- **Icons** are optional Iconify names (`i-simple-icons-*` or `i-lucide-*`); without one, the
  category icon is used.
- Services without a `url` are background services, hidden unless toggled on.
- **Favorites** are starred per browser (stored in `localStorage`) and pinned at the top of the
  page and of the launcher.

### Shortcuts

- <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> — open the launcher
- <kbd>/</kbd> — focus the filter; <kbd>Enter</kbd> opens the first match, <kbd>Esc</kbd> clears it

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
