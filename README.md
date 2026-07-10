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

## Structure of the tree

```
web/
├── public/
│   └── images/
├── src/
│   ├── auth/
│   │   ├── auth.ts                # Better Auth configuratie + Drizzle adapter
│   │   └── auth-handler.ts        # Handler die de auth‑endpoints afhandelt
│   ├── db/
│   │   ├── schema.ts              # Drizzle schema (alle tabellen)
│   │   ├── seed.ts                # Import‑script voor MealDB
│   │   └── index.ts               # Databaseverbinding
│   ├── server/
│   │   └── functions/
│   │       ├── recipes.server.ts  # Server functions voor recepten
│   │       ├── favorites.server.ts
│   │       ├── profile.server.ts
│   │       ├── shopping.server.ts
│   │       ├── contact.server.ts
│   │       ├── admin.server.ts
│   │       └── history.server.ts  # Voor recept‑geschiedenis
│   ├── routes/
│   │   ├── __root.tsx             # Root layout
│   │   ├── index.tsx              # Homepage
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── $.ts           # Catch‑all voor Better Auth (/api/auth/*)
│   │   ├── recipes/
│   │   │   ├── index.tsx          # Overzicht
│   │   │   └── $id.tsx            # Detail
│   │   ├── profile/
│   │   │   └── index.tsx
│   │   └── ...
│   ├── styles/
│   │   └── globals.css
│   ├── app.config.ts              # TanStack Start configuratie
│   ├── entry.client.tsx
│   └── entry.server.tsx
├── drizzle/
│   └── migrations/
├── .env
├── package.json
├── tsconfig.json
└── vite.config.ts
```