---
title: Documentatie Informatie
description: Versiebeheer, auteursgegevens en officiële documentkenmerken van het SuriHealth project handboek.
---

Dit document dient als het officiële technische en functionele handboek voor de oplevering en live demonstratie van de SuriHealth webapplicatie. Het beschrijft de volledige migratiecyclus, de achterliggende medische filterregels en de administratieve controle-omgeving.

---

## Officiële Document Kenmerken

De onderstaande matrix toont het actuele versiebeheer en de identificatiekenmerken van deze systeemdocumentatie:

| Document Parameter | Officiële Systeeminformatie & Status |
| :--- | :--- |
| **Projectnaam** | SuriHealth |
| **Document Versie** | v2.0 |
| **Architectuur Status** | Express + Prisma ➔ TanStack Start + Drizzle ORM |
| **Database Engine** | PostgreSQL |
| **Authenticatie Adapter** | Better Auth Cryptografische Token Validator |
| **Opleverdatum** | Augustus 2026 |
| **Laatste Systeemupdate** | Augustus 2026 |
| **Auteursrecht (Auteur)** | FemTech Alliance |

---

## Doelstelling en Reikwijdte

Dit handboek is samengesteld met als doel de examencommissie en beoordelaars een sluitend, transparant en diepgaand inzicht te geven in de softwarematige keuzes die tijdens het ontwikkeltraject zijn gemaakt. 

Het document dekt de volgende kritieke softwarematige infrastructuren af:
1. **De RPC Communicatielaag**: Hoe frontend componenten asynchroon backend-functies aanroepen via `createServerFn` zonder traditionele API-vertragingen.
2. **De Klinische Validatiemotor**: De manier waarop `recipeFilters.ts` de privacygevoelige medische condities uit PostgreSQL analyseert om risicovolle ingrediënten uit te sluiten.
3. **De Runtime Energie Matrix**: De werking van de `calorieCalculator.ts` motor die op basis van een RegEx-matrix en Set-deduplicatie portie-accurate calorieën calculeert.

---

## Intellectueel Eigendom & AVG Compliance

:::note
Alle medische gegevens, biometrische inputs (zoals gewicht en leeftijd) en contactberichten die binnen de database-tabellen van SuriHealth worden verwerkt, vallen onder strikte server-side encryptie via Better Auth. Dit handboek bevat uitsluitend geanonimiseerde dummy-data en abstracte codevoorbeelden ter illustratie van de werking van de software.
:::

:::tip
Mochten er tijdens het doornemen van deze documentatie functionele of technische vragen ontstaan omtrent specifieke algoritmen of de Drizzle-databasestructuur, raadpleeg dan direct de [Verklarende Woordenlijst](/guides/glossary/) voor een uitgebreide toelichting van alle gebruikte vaktermen.
:::