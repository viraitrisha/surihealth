# SuriHealth Web Application

Dit component bevat de full-stack broncode van het SuriHealth maaltijdplatform. De applicatie is opgebouwd als een hybride Single Page Application (SPA) met Server-Side Rendering (SSR) via het TanStack Start framework, aangedreven door Drizzle ORM en een PostgreSQL database-cluster.

---

## Technische Techstack (Architecture)

- **Frontend & Server Framework**: TanStack Start (React v18) & Vinxi Server Bundler
- **Database & Mapping**: PostgreSQL & Drizzle ORM (Type-safe SQL Client)
- **Authenticatie Engine**: Better Auth (Native Drizzle Server Adapter)
- **Data Validatie**: Zod Schema Enforcement (Client & Server-side validation)
- **Styling & Layout**: Tailwind CSS & CSS Custom Properties (Realtime Light/Dark mode transitions)
- **Icoongrafie**: Lucide React Vector Icons (Geen bitmap emoji's)

---

## Systeemvereisten & Voorwaarden (Prerequisites)

Voordat u de applicatie lokaal kunt installeren en opstarten, dient uw ontwikkelomgeving te beschikken over de volgende softwarecomponenten:

1. **Node.js Runtime**: Versie `v18.x` of `v20.x` (LTS-versies worden aanbevolen voor optimale runtime-compatibiliteit met de Nitro-server).
2. **Package Manager**: `pnpm` (versie 8.x of nieuwer) is vereist voor monorepo-afhandeling en type-safe route-generatie.
3. **Database Engine**: Een actieve instantie van **PostgreSQL** (versie 14, 15 of 16), lokaal draaiend op poort `5432` of via een extern cloud-cluster (Neon Postgres). De database moet `JSONB` datatypes ondersteunen.

---

## Omgevingsvariabelen (Environment Variables)

Maak in de map `web/` een bestand aan genaamd `.env` en configureer de volgende runtime-variabelen:

```env
# De live of lokale connectiestring naar uw PostgreSQL database
DATABASE_URL="postgresql://postgres:password@localhost:5432/database"

# De basis URL van de applicatie (nodig voor Better Auth redirects)
BETTER_AUTH_URL="http://localhost:3000"

# Een unieke, cryptografische sleutel van exact 32 tekens voor sessieversleuteling
BETTER_AUTH_SECRET="super_duper_secret_key"
```

---

## Installatiegids (Installation)

Volg deze stappen in uw PowerShell-terminal om de applicatie en de bijbehorende database-tabellen volledig operationeel te maken:

### 1. Dependencies installeren
Navigeer naar de map `web/` en installeer alle vereiste bibliotheken:
```powershell
pnpm install
```

### 2. Database Schema Push
Schiet de type-safe tabellen (`user`, `session`, `profile`, `recipe`, `contacts`) direct in uw PostgreSQL database via de Drizzle-kit:
```powershell
pnpm drizzle-kit push
```

### 3. Database Seed (Master-Catalogus vullen)
Voer het seed-script uit om de database live te vullen met de 485 traditionele en medisch verantwoorde Surinaamse recepten:
```powershell
pnpm tsx src/db/seed.ts
```

---

## Applicatie Gebruik & Beheer (Usage)

U kunt de applicatie in twee verschillende modi opstarten, afhankelijk van uw testdoeleinden:

### Ontwikkelmodus (Development)
Om de code lokaal te bewerken met automatische route-generatie en Hot Module Replacement (HMR), gebruikt u:
```powershell
pnpm dev
```
De applicatie start op en is direct lokaal bereikbaar via: `http://localhost:3000`

### Productiemodus (Production Build & Start)
Om de applicatie geoptimaliseerd te compileren en de Nitro-server live op te starten (zoals deze in de cloudomgeving op Render draait), voert u deze reeks uit:
```powershell
# 1. Genereer de type-safe route boom index opnieuw
pnpm generate-routes

# 2. Bouw de applicatie volledig opnieuw op
pnpm build

# 3. Start de standalone Nitro-server service
$env:BETTER_AUTH_URL="http://localhost:3000"; $env:DATABASE_URL="postgresql://username:password@localhost:5432/database"; node .output/server/index.mjs
```

---

## Beveiliging & Autorisatie Regels

- **Gereserveerd Admin Account**: Het platform bevat een automatische seeder. Als u inlogt met het e-mailadres `surihealth@gmail.com` en wachtwoord `surihealth123`, activeert de backend direct de database-rol `'admin'`, waarmee het beheer-dashboard en de support-desk worden ontgrendeld.
- **Harde Blokkeer Interceptor**: Gebruikers die door de admin op `blocked: true` worden gezet, worden bij elke API-aanroep direct geweigerd met een harde `403 Forbidden` statuscode op serverniveau.