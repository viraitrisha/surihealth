---
title: Verklarende Woordenlijst
description: Technische, fysiologische en database-architecturale begrippen binnen het SuriHealth maaltijdplatform.
---

Deze woordenlijst bevat de definities van de belangrijkste technische infrastructuren, cryptografische protocollen en medisch-fysiologische calculatiemotoren die binnen de full-stack architectuur van SuriHealth worden gehanteerd.

---

## Technische & Architecturale Begrippen

| Vakterm / Afkorting | Technische Betekenis en Functie binnen het Platform |
| :--- | :--- |
| **RPC (Remote Procedure Call)** | Het communicatiemodel van TanStack Start (`createServerFn`). Hiermee roept de frontend asynchroon serverfuncties aan via beveiligde, on-the-fly gegenereerde HTTP-POST-aanvragen, wat losse REST-controllers overbodig maakt. |
| **Drizzle ORM** | Een snelle, type-safe Object-Relational Mapper die TypeScript-definities direct vertaalt naar geoptimaliseerde SQL-queries, zonder de overhead of tijdelijke cache-vertragingen van traditionele databasesystemen. |
| **JSONB Datatype** | Een binary-opslagformaat in PostgreSQL waarin de maaltijdetiketten (`mealTypes`) flexibel als matrix-arrays zijn opgeslagen. Dit maakt dynamische, case-insensitive string-normalisaties mogelijk. |
| **Better Auth** | De centrale beveiligings- en authenticatielaag van het platform. Better Auth beheert sessie-tokens direct via PostgreSQL en dwingt server-side *Role-Based Access Control (RBAC)* af om onbevoegde API-toegang te blokkeren. |
| **Zod Schema Enforcement** | Een TypeScript-validatiebibliotheek die de invoer van formulieren (zoals de medische intake of de recepten-CRUD) aan de server-zijde controleert om SQL-injecties of corrupte records te voorkomen. |
| **Vinxi Bundler** | De onderliggende full-stack server- en compiler-engine van TanStack Start die de frontend-omgeving en backend-functies compileert tot een enkele, geconsolideerde Nitro-productiebuild. |
| **Router Invalidation** | De procedure (`router.invalidate()`) waarmee de browser-caches na een database-mutatie geforceerd worden geleegd. Dit voorkomt dat weergave-data op het scherm terugspringt naar oude waarden. |

---

## Medisch-Fysiologische Begrippen

| Vakterm / Parameter | Fysiologische Functie binnen het Algoritme |
| :--- | :--- |
| **Harris-Benedict Formule** | De klinische rekenmethode waarmee de backend live de basale energiebehoefte (BMR) berekent op basis van het ingevoerde gewicht, de lengte, leeftijd en de biologische genderspecifieke correctiefactor. |
| **Body Mass Index (BMI)** | Een internationale biometrische indicator (gewicht gedeeld door lengte in het kwadraat) die live op de profielpagina wordt gecalculeerd om de gewichtsstatus van de gebruiker visueel te categoriseren. |
| **Dieet Veiligheidsscore** | Een door ons ontworpen analytische matrix-index die de strengheid van uw actieve medische filters berekent. Elke geactiveerde chronische aandoening of allergie verhoogt de intensiteit van de recept-ingrediëntenscans. |
| **Set-Deduplicatie** | Het softwaremechanisme (`new Set()`) binnen de calorieënteller dat voorkomt dat ingrediënten dubbel worden geteld door meertalige database-termen (zoals het gelijktijdig scannen van "Kip" en "Chicken"). |
| **Natrium-Uitsluiting** | Het RegEx-filterpatroon binnen `recipeFilters.ts` dat zware natriumbronnen (zoals traditioneel Surinaams zoutvlees, bakkeljauw of Maggi-blokjes) herkent en permanent blokkeert voor hypertensie-profielen. |

---

## Diagnostische Richtlijnen

:::note
Deze begrippenlijst sluit nauwkeurig aan op de gebruikte functienamen en database-kolommen binnen de broncode van SuriHealth. Tijdens de live verdediging of demonstratie van het project kunt u deze tabel raadplegen om de achterliggende full-stack keuzes helder toe te lichten aan de examencommissie.
:::

:::tip
Mochten er tijdens het testen van de applicatie foutmeldingen in uw terminal verschijnen die verwijzen naar een van deze termen (zoals een Zod-validatiefout), raadpleeg dan direct de gids [Problemen & Oplossingen](/guides/probleem-oplossing/) om de juiste herstelprocedure uit te voeren.
:::