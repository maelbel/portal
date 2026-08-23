# Portal

Portail personnel listant les services auto-hébergés (homelab) : recherche et filtre par tags.

## Stack

- [Nuxt 4](https://nuxt.com) + [Nuxt UI](https://ui.nuxt.com) + Tailwind CSS

## Services

Les services affichés sont définis en dur dans `app/services.config.ts` (label, url, containerName, tags). Pour ajouter, modifier ou retirer un service, on édite ce fichier et on redéploie — pas de base de données ni d'API.

## Setup

Installer les dépendances :

```bash
pnpm install
```

## Développement

```bash
pnpm dev
```

Ou via Docker Compose :

```bash
docker compose up
```

L'app est servie sur `http://localhost:3000`.

## Scripts

- `pnpm lint` — ESLint
- `pnpm typecheck` — vérification des types Nuxt/Vue
- `pnpm build` / `pnpm preview` — build et prévisualisation de production

## Déploiement

Le portail n'est pas exposé publiquement — il tourne derrière Traefik sur le réseau interne (`portal.maelbelliard.fr`), accessible uniquement depuis le réseau local/VPN de l'auteur. Le `docker-compose.yml` construit l'image en cible `development` avec le code monté en volume.
