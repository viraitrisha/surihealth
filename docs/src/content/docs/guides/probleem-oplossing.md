---
title: Problemen & Oplossingen
description: Technische foutenopsporing, runtime-herstelprocedures en foutoplossing voor het SuriHealth maaltijdplatform.
---

Tijdens het gebruik of het lokaal testen van het SuriHealth full-stack platform kunnen er door netwerkschommelingen, database-omstellingen of compiler-caches technische runtime-fouten optreden. Deze gids biedt beheerders en ontwikkelaars een sluitend overzicht van de meest voorkomende foutenstromen en de bijbehorende diagnostische herstelprocedures.

---

## Technische Foutenopsporing (Troubleshooting Matrix)

De onderstaande matrix dekt de full-stack foutenstromen af tussen de React-frontend, de TanStack Start server-functions en de PostgreSQL database-laag:

| Geobserveerde Fout / Symptoom | Waarschijnlijke Technische Oorzaak | Definitieve Oplossing & Herstelprocedure |
| :--- | :--- | :--- |
| **Het scherm blijft leeg (leeg dashboard)** | Case-sensitive mismatch in de database `jsonb` string-arrays of een vastgelopen Vinxi-router cache. | Voer een geforceerde browser-verversing uit (`Ctrl + F5`) of wis de `.vinxi` map in PowerShell om de route-index opnieuw op te bouwen. |
| **Inloggen faalt met een 403 statuscode** | De databasevlag `blocked: true` is geactiveerd door een beheerder binnen de `users` tabel. | De toegang voor dit account is permanent ingetrokken. Neem contact op met de database-administrator om de statusvlag te deactiveren. |
| **Inloggen of registreren faalt met een 401 statuscode** | Het wachtwoord is onjuist of het session-cookie van Better Auth is verlopen in de browser. | Wis uw browsercookies, controleer uw inloggegevens en voer de aanmelding opnieuw uit om een vers token te genereren. |
| **Recepten tonen continu 850 kcal** | De ingrediënten-array bevat dubbele Engelse en Nederlandse vertalingstokens (Kip/Chicken). | Werk uw `recipes.ts` server-function bij met de nieuwe `estimateRecipeCalories` Set-deduplicatiemotor om data-inflatie te stoppen. |
| **De admin-pagina's tonen een laadlus** | De beller is ingelogd met een consumenten-account dat niet over de database-rol `'admin'` beschikt. | Log uit en meld u opnieuw aan met de gereserveerde beheerder-credentials (`surihealth@gmail.com`). |
| **Foutmelding: "Database connection refused"** | PostgreSQL draait niet op de achtergrond of luistert niet op de vereiste poort `5432`. | Open uw PostgreSQL-omgeving (bijv. pgAdmin of Docker), controleer of de service actief is en verifieer uw `DATABASE_URL`. |

---

## Geavanceerd Cache-Herstel voor Ontwikkelaars

Mocht de applicatie na het wijzigen van server-functions of router-bestanden onverwacht gedrag vertonen, dan komt dit doordat de interne Vite- en Vinxi-compilers een oude build-state vasthouden in het werkgeheugen.

Volg deze PowerShell-opdrachtreeks in uw terminal om de volledige ontwikkelomgeving schoon te resetten en opnieuw te indexeren:

```powershell
# 1. Navigeer naar de hoofdmap van de applicatie
cd web

# 2. Sluit de actieve server af via Ctrl + C en wis alle verborgen cache-mappen
Remove-Item -Recurse -Force .vinxi, .tanstack, .astro, dist, node_modules/.vite -ErrorAction Ignore

# 3. Genereer de type-safe TanStack routeboom index opnieuw
pnpm generate-routes

# 4. Compileer een schone build en start de Nitro-server live opm
pnpm build
\$env:BETTER_AUTH_URL="http://localhost:3000"
\$env:DATABASE_URL="postgresql://postgres:password@localhost:5432/dev_surihealth"
node .output/server/index.mjs
```

---

## Diagnostische Ondersteuning & Support

:::note
Wanneer u handmatig wijzigingen doorvoert in de medische vragenlijst (`profile.tsx`), wist de applicatie direct de verouderde gegevens-caches via de router-methode `router.invalidate()`. Dit garandeert dat uw maaltijdsuggesties op het dashboard nooit achterlopen op uw actieve gezondheidsstatus.
:::

:::caution
Voer nooit zomaar willekeurige SQL-scripts uit op de live PostgreSQL-tabellen buiten Drizzle ORM om te proberen fouten op te lossen. Handmatige wijzigingen buiten de schema-migraties om kunnen de integriteit van de relationele tabellen (`userHistory`, `favorites`, `profiles`) permanent beschadigen, wat leidt tot cascade-crashes binnen de gebruikersaccounts.
:::
