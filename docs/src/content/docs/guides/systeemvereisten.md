---
title: Systeemvereisten
description: Technische en softwarematige vereisten voor gebruikers, beheerders en ontwikkelaars van SuriHealth.
---

Het SuriHealth maaltijdplatform is gebouwd op basis van een moderne, lichtgewicht en responsive full-stack architectuur. Hierdoor stelt de applicatie minimale eisen aan de hardware van de eindgebruiker, terwijl de server-laag is geoptimaliseerd voor veilige, realtime SQL-gegevensverwerking.

---

## Vereisten voor Eindgebruikers (Client-Side)

Om toegang te krijgen tot het consumenten-dashboard, de medische vragenlijst en de maaltijdplanners, heeft de gebruiker een apparaat nodig dat voldoet aan de volgende basisspecificaties:

### 1. Ondersteunde Apparaten
Het platform maakt gebruik van een vloeiende, responsive lay-out via Tailwind CSS en CSS Custom Properties. De applicatie schaalt hierdoor automatisch mee op:
- Desktop computers en laptops (Windows, macOS, Linux, ChromeOS).
- Tablets (iPadOS, Android-tablets).
- Smartphones (iOS, Android).

### 2. Internetverbinding
- Een actieve internetverbinding (Wi-Fi, 4G of 5G) is vereist om realtime verzoeken te sturen naar de server-functions. 
- Dankzij de server-side rendering (SSR) van TanStack Start is het dataverbruik minimaal, waardoor de applicatie ook vlekkeloos functioneert op mobiele netwerken met een lagere bandsnelheid.

### 3. Ondersteunde Webbrowsers
De applicatie maakt gebruik van moderne ECMAScript-standaarden en beveiligde cookie-protocollen voor Better Auth. Gebruik een up-to-date versie van een van de volgende browsers:
- Google Chrome (versie 100 of nieuwer)
- Apple Safari (versie 15 of nieuwer)
- Microsoft Edge (versie 100 of nieuwer)
- Mozilla Firefox (versie 100 of nieuwer)

:::note
Zorg ervoor dat cookies en JavaScript zijn ingeschakeld in uw browserinstellingen. Dit is noodzakelijk om uw medische profielfilters en de Better Auth inlogsessies veilig te kunnen bewaren.
:::

---

## Vereisten voor Ontwikkelaars & Beheerders (Server-Side)

Wilt u de applicatie lokaal opstarten, de database beheren via het admin-paneel, of de runtime code compileren? Dan dient de klonomgeving of server te voldoen aan de volgende softwarematige infrastructuur:

### 1. Runtime Omgeving
- **Node.js**: Versie `v18.x` of `v20.x` (LTS-versies worden aanbevolen voor optimale runtime compatibiliteit met de Vinxi bundler).
- **Package Manager**: `pnpm` (versie 8.x of nieuwer) is vereist voor het beheren van de monorepo workspaces en route-generatie.

### 2. Database & ORM Laag
- **PostgreSQL**: Versie 14, 15 of 16 (Draaiend op poort `5432`). De database moet `JSONB` datatypes ondersteunen om de maaltijdtypes (`meal_types`) en ingrediënten-arrays correct te verwerken.
- **Drizzle ORM**: Voor het uitvoeren van schema-migraties en dynamische SQL-queries (`$dynamic()`).

### 3. Authenticatie & Beveiliging
- **Better Auth Environment**: De server moet toegang hebben tot een actieve `BETTER_AUTH_URL` en een veilige database-connectiestring (`DATABASE_URL`) om de poortwachters-sessies en encryptie-sleutels correct te initialiseren tijdens de opstartfase.

:::tip
Raadpleeg de installatiestappen en de PowerShell-opstartvolgorde in de hoofd-`README.md` van de applicatie om de server-omgeving binnen enkele minuten foutloos op te zetten.
:::