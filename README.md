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
├── .vscode/
│   └── settings.json
├── public/
│   ├── favicon.ico
│   └── images/                  # eventueel statische afbeeldingen
├── src/
│   ├── auth/
│   │   ├── auth.ts              # Better Auth configuratie
│   │   └── auth-handler.ts      # handler voor auth-endpoints (optioneel)
│   ├── db/
│   │   ├── schema.ts            # Drizzle schema (tabellen)
│   │   └── seed.ts              # import script voor MealDB
│   ├── lib/
│   │   ├── db.ts                # Drizzle + PostgreSQL verbinding
│   │   ├── filter.ts            # filterlogica recepten op basis van profiel
│   │   └── auth-utils.ts        # hulpfuncties voor sessie/gebruiker
│   ├── routes/
│   │   ├── __root.tsx           # root layout (TanStack Route)
│   │   ├── index.tsx            # homepagina
│   │   ├── auth/
│   │   │   ├── login.tsx        # inlogpagina (frontend)
│   │   │   └── register.tsx     # registratiepagina (frontend)
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── $.ts         # catch-all handler voor Better Auth (/api/auth/*)
│   │   │   ├── auth.server.ts   # serverfuncties: register, login, logout, changePassword
│   │   │   ├── recipes.server.ts
│   │   │   ├── favorites.server.ts
│   │   │   ├── profile.server.ts
│   │   │   ├── shopping.server.ts
│   │   │   ├── contact.server.ts
│   │   │   └── admin.server.ts  # import trigger
│   │   ├── recipes/
│   │   │   ├── index.tsx        # overzichtspagina (frontend)
│   │   │   └── $id.tsx          # detailpagina (frontend)
│   │   ├── profile/
│   │   │   └── index.tsx        # profielpagina (frontend)
│   │   └── ...                  # eventuele andere frontend routes
│   ├── styles/
│   │   └── globals.css          # Tailwind CSS
│   ├── app.config.ts            # TanStack Start configuratie
│   ├── entry.client.tsx         # client entry
│   └── entry.server.tsx         # server entry (indien nodig)
├── drizzle/
│   ├── meta/
│   └── 0000_initial.sql         # gegenereerde migraties
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── drizzle.config.ts
```