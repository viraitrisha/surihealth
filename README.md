# SuriHealth

SuriHealth is een modern, full-stack webplatform ontworpen om de traditionele Surinaamse eetcultuur te synchroniseren met medische en klinische voedingsrichtlijnen. Het platform migreert de legacy Express + Prisma + MySQL architectuur volledig naar een geconsolideerd **TanStack Start (RPC)** ecosysteem aangedreven door **Drizzle ORM** en **PostgreSQL**.

---

## Project Componenten (Project Structure)

Het SuriHealth-project is georganiseerd als een ontkoppelde monorepo-architectuur om een strikte scheiding van belangen, maximale schaalbaarheid en DevOps-efficiëntie te garanderen. Het project bestaat uit de volgende twee hoofdcomponenten:

### 1. De Hoofdapplicatie (`/web`)
Dit is het kloppende hart van het platform. Deze map bevat de volledige full-stack broncode van de applicatie die live is ondergebracht op **Render** met een serverless **Neon PostgreSQL** database-cluster.
- **`/src/routes/`**: De type-safe routeboom aangedreven door TanStack Router, inclusief de medische profile-setup, de consumenten-dashboards en de streng beveiligde beheerdersomgeving (`/admin/*`).
- **`/src/server-functions/`**: De RPC-communicatielaag (`createServerFn`) die asynchrone database-mutaties en database-queries direct isoleert op de server-laag.
- **`/src/utils/`**: De analytische reken- en filterkernen van de software, waaronder de medische RegEx-scan (`recipeFilters.ts`) en de on-the-fly calorieteller (`calorieCalculator.ts`).
- **`/src/db/`**: De database-infrastructuur met de type-safe schema-definities (`schema.ts`), de Drizzle-migratiebestanden en het automatische database seed-script (`seed.ts`).

### 2. De Systeemdocumentatie (`/docs`)
Dit is het uitgebreide, interactieve technische en functionele handboek van het platform. Dit component is gebouwd met **Astro Starlight** en is volledig onafhankelijk en gratis gehost op **Vercel** als een statische site (SSG).
- **`/src/content/docs/`**: Bevat alle gestructureerde documentatiegidsen in Markdown- en MDX-formaat (van installatiegidsen tot gedetailleerde scherminformatie).
- **`/src/styles/custom.css`**: Het centrale merkkleur-stijlblad dat de documentatiewebsite transformeert naar de officiële, rustgevende **SuriHealth Teal-huisstijl** (100% emojivrij).
- **`astro.config.mjs`**: Het centrale configuratiebestand waarin de type-safe navigatiematrix, icons en CSS-koppelingen van het handboek zijn vastgelegd.

---

## Architectuur & Communicatielaag

*   **Zero-API Overlap (RPC)**: Alle client-server communicatie verloopt via type-safe TanStack Start server functions (`createServerFn`). Dit elimineert de noodzaak voor losse REST-controllers.
*   **BFF (Backend-for-Frontend) Isolatie**: Hoewel de frontend componenten de server-functions direct importeren, splitst de compiler (`Vinxi`) de code doormidden. Database-queries en SQL-logica blijven **100% geïsoleerd op de server**.
*   **Volledig Sluitend Cache Beheer**: Geïntegreerde frontend-spiegeling via `localStorage` in combinatie met harde paginarefreshes vernietigt TanStack loader-caches direct na een mutatie. Dit garandeert dat gebruikersgegevens nooit terugspringen naar oude waarden.

---

## Beveiliging & Authenticatie Matrix (Better Auth)

*   **Session Token Cryptografie**: Authenticatie, registratie en sessiebeheer worden afgehandeld via **Better Auth** met de native Drizzle-adapter. Er worden geen onveilige, handmatige JWT-handlers gebruikt.
*   **Server-Side Access Control (RBAC)**: Beveiliging wordt strikt aan de server-zijde afgedwongen binnen de handlers door de actieve sessie-cookies te verifiëren via `auth.api.getSession`.
*   **Hard-Coded Admin Safeguards**: Kritieke administratieve routes (`/admin/*`) en endpoints zijn beveiligd met een database-interceptor in `src/routes/api/auth/$.ts`. Verzoeken van niet-geautoriseerde gebruikers of geblokkeerde accounts worden direct op serverniveau afgebroken met een `403 Forbidden`.

---

## Geavanceerde Core Features

### 1. Medische & Allergie Filter Engine (`recipeFilters.ts`)
*   **Diabetes Status**: Sluit automatisch alle suikerrijke desserts, gebak en snacks uit.
*   **Hoge Bloeddruk & Zoutarm**: Analyseert ingrediënten arrays via RegEx en filtert direct zware natriumbronnen (zoals traditioneel zoutvlees, bakkeljauw en Maggi-bouillonblokjes) uit het menu.
*   **Cholesterol & Hartklachten**: Blokkeert gerechten met een hoog gehalte aan verzadigde vetten (zoals varkensvlees/pingo, reuzel en zware zuivelproducten).
*   **Dieetplanners**: Volledige ondersteuning voor **Gluten-vrij, Lactose-vrij, Vegetarisch** en **Veganistisch** door gerichte eliminatie van allergenen en dierlijke extracten.

### 2. Runtime Portion Calorie Matrix (`calorieCalculator.ts`)
*   **On-The-Fly Berekening**: Omdat externe API's (zoals The MealDB) geen calorieën leveren, scant deze ingebouwde engine ingrediënten runtime.
*   **Deduplicatie Master**: Om te voorkomen dat tweetalige ingrediënten (bijv. "kip" en "chicken") dubbel worden geteld, zuivert een JavaScript `Set` de invoer voordat deze langs de 12 macro-voedselgroepen wordt gehaald. Dit levert een uiterst realistische, on-inflated caloriewaarde op per portie.

### 3. Gepersonaliseerde Categorie Navigatie (`category.tsx`)
*   **Type-Safe Parameters**: "Bekijk alles" knoppen op het dashboard sturen gebruikers naar een specifieke route via TanStack Search Parameters (`?mealType=lunch`).
*   **Case-Insensitive Array Parsing**: Database JSONB velden worden via een fail-safe parser omgezet naar kleine letters. Dit voorkomt layout-gaten en zorgt ervoor dat de rij exact de juiste gefilterde maaltijden toont.

### 4. Admin Dashboard Inbox & CRUD Console
*   **Volledige Recepten CRUD**: Beheerders kunnen nieuwe recepten invoegen, live de calorische waarde monitoren tijdens het typen van ingrediënten, of items toevoegen aan de prominente *Top Picks* carrousel.
*   **Support Inbox Desk**: Een split-pane communicatiepaneel laadt binnengekomen contactformulieren in, valideert de tickets, en activeert via een double-action formulier direct native mailto-workflows.

---

## Technologische Techstack

*   **Framework**: TanStack Start (React) & Vinxi Bundler
*   **Database-laag**: PostgreSQL & Drizzle ORM (No Prisma)
*   **Authenticatie**: Better Auth (Drizzle Adapter)
*   **Validatie**: Zod Schema Enforcement
*   **Styling**: Tailwind CSS & CSS Custom Properties (`data-theme` Light/Dark responsive switching)
*   **Icoongrafie**: Lucide React Vector Icons (No Emojis)

---

## Applicatie Lokaal Opstarten (Terminal)

Volg deze stappen in **PowerShell** om de compiler-cache op te schonen en de applicatie in de schone productiemodus te draaien:

```powershell
# 1. Navigeer naar de projectmap
cd web

# 2. Installeer de nodige dependencies
pnpm install

# 3. Wis eventuele vastgelopen route- en vinxi caches
Remove-Item -Recurse -Force .vinxi, .tanstack -ErrorAction Ignore

# 4. Genereer de type-safe route boom index
pnpm generate-routes

# 5. Compileer de applicatie volledig opnieuw voor productie
pnpm build

# 6. Start de gecompileerde Nitro-server live op met de juiste variabelen
$env:BETTER_AUTH_URL="http://localhost:3000"; $env:DATABASE_URL="postgresql://postgres:vanshika@localhost:5432/dev_surihealth"; node .output/server/index.mjs
```