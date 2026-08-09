# Portail

Portail personnel listant les services auto-hébergés (homelab) : recherche, filtre par tags, et gestion (créer / éditer / supprimer) des services et de leurs tags.

## Stack

- [Nuxt 4](https://nuxt.com) + [Nuxt UI](https://ui.nuxt.com) + Tailwind CSS
- Pinia pour l'état du store `services`
- Prisma 7 (adapter `pg`) + PostgreSQL

## Modèle de données

- `Service` : `label`, `url`, `containerName`, tags associés
- `Tag` : `label` (unique), services associés (relation many-to-many)

## Setup

Installer les dépendances :

```bash
pnpm install
```

Copier `.env.example` en `.env` et renseigner `DATABASE_URL`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`.

## Développement

```bash
pnpm dev
```

Ou via Docker Compose (démarre aussi Postgres) :

```bash
docker compose up
```

L'app est servie sur `http://localhost:3000`.

## Scripts

- `pnpm lint` — ESLint
- `pnpm typecheck` — vérification des types Nuxt/Vue
- `pnpm build` / `pnpm preview` — build et prévisualisation de production

## API

- `GET/POST /api/services`, `GET/PUT/DELETE /api/services/:id`
- `GET/POST /api/tags`, `PUT/DELETE /api/tags/:id`

## Déploiement

Le portail n'est pas exposé publiquement — il tourne derrière Traefik sur le réseau interne (`portail.maelbelliard.fr`), accessible uniquement depuis le réseau local/VPN de l'auteur. Le `docker-compose.yml` construit l'image en cible `development` avec le code monté en volume.
