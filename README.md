### SuriHealth

## Structure of the tree

```
web/
├── .vscode/
├── public/
│   └── favicon.ico
├── src/
│   ├── auth/
│   │   ├── auth.ts             ← Better Auth config
│   │   └── auth-handler.ts     ← server handler voor auth endpoints
│   ├── db/
│   │   ├── schema.ts           ← Drizzle schema (User, Profile, Recipe, etc.)
│   │   └── seed.ts             ← script om recepten te importeren
│   ├── lib/
│   │   ├── db.ts               ← Drizzle + pg verbinding
│   │   └── filter.ts           ← filterlogica voor recepten
│   ├── routes/
│   │   ├── __root.tsx          ← root layout
│   │   ├── index.tsx           ← homepagina
│   │   ├── auth/
│   │   │   ├── login.tsx       ← loginpagina (frontend team)
│   │   │   ├── register.tsx    ← registreren
│   │   │   └── ... (frontend)
│   │   ├── api/
│   │   │   ├── auth.server.ts  ← login/register/logout/change-password
│   │   │   ├── recipes.server.ts
│   │   │   ├── favorites.server.ts
│   │   │   ├── profile.server.ts
│   │   │   ├── shopping.server.ts
│   │   │   ├── contact.server.ts
│   │   │   └── admin.server.ts
│   │   ├── recipes/
│   │   │   ├── index.tsx       ← receptenoverzicht (frontend)
│   │   │   └── $id.tsx         ← detailpagina (frontend)
│   │   ├── profile/
│   │   │   └── ... (frontend)
│   │   └── ...
│   ├── styles/
│   │   └── globals.css
│   ├── app.config.ts           ← TanStack Start config
│   └── entry.client.tsx / entry.server.tsx (indien nodig)
├── drizzle/
│   ├── meta/
│   └── 0000_initial.sql        (gegenereerde migraties)
├── package.json
├── tsconfig.json
└── vite.config.ts
```