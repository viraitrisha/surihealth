### SuriHealth

De volledige backend migreren van Express + Prisma + MySQL naar TanStack Start met Drizzle ORM + PostgreSQL, Better Auth voor authenticatie, en server functions als communicatielaag naar de React-frontend.

Tegelijk wordt de filtering op dieet, allergieën, voorkeuren en Surinaamse beschikbaarheid gerealiseerd, mét vertaling van ingrediënten naar het Nederlands.

- Alle client-server communicatie verloopt via TanStack Start server functions (createServerFn).
- Server functions worden gedefinieerd in src/server/ en geïmporteerd in routebestanden (src/routes/api/*.ts) die de request afhandelen.

## Backend Techstack

```
Drizzle ORM met PostgreSQL (No Prisma)
Better Auth met Drizzle-adapter voor inloggen, registreren, sessies (No JWT-handlers)
Zod voor validatie van input op de server
i18n/vertaling van ingrediënten via een statisch Engels -> Nederlands
```

## Run on terminal
```bash
cd web
pnpm build
$env:BETTER_AUTH_URL="http://localhost:3000"; $env:DATABASE_URL="postgresql://postgres:vanshika@localhost:5432/dev_surihealth"; node .output/server/index.mjs
```