---
title: Boodschappenlijst
description: Handleiding voor het inzien, handmatig toevoegen en realtime muteren van ingrediënten binnen uw SuriHealth boodschappenoverzicht.
---

De digitale boodschappenlijst (`/dashboard/shopping`) fungeert als een dynamische assistent die gebruikers helpt bij het verzamelen van de benodigde basiselementen voor hun medisch verantwoorde Surinaamse maaltijden. De pagina synchroniseert live met de PostgreSQL-tabellen via het TanStack Start framework om te zorgen dat uw ingrediënten direct op al uw apparaten beschikbaar zijn.

---

## Hoe komen ingrediënten op de lijst?

Het platform ondersteunt twee afzonderlijke, flexibele invoermethoden om uw lijst op te bouwen:

### 1. Geautomatiseerde Recept-Extractie
- Wanneer u op de specifieke detailpagina van een gerecht (`/dashboard/recipes/view/$recipeId`) op de knop *Boodschappenlijst maken* klikt, leest de server-function `addShoppingItem` de ingrediënten-array uit. Alle ingrediënten (zoals kouseband, pompoen of vis) worden direct en asynchroon in bulk naar uw centrale boodschappenlijst doorgestuurd.

### 2. Handmatige Invoer op de Pagina
- Bovenaan de boodschappenlijst bevindt zich een compact invoerveld. Hier kunt u handmatig extra huishoudelijke producten of losse Surinaamse ingrediënten intypen. Klik op de toevoegknop om het item direct via een veilige database-mutatie aan uw actieve lijst toe te voegen.

---

## Muteren en Afvinken in de Supermarkt

De interface is specifiek geoptimaliseerd voor gebruik op smartphones tijdens het boodschappen doen, zodat u de ingrediënten in de winkel efficiënt kunt beheren:

- **Items Afvinken / Verwijderen**: Elk ingrediënt op de lijst is voorzien van een interactieve actieknop (prullenbak- of vink-icoon). 
- **Realtime Database Verwerking**: Zodra u een product afvinkt of verwijdert, activeert de frontend direct op de achtergrond een asynchrone server-function. De rij wordt direct permanent gewist uit PostgreSQL, en de kaart verdwijnt onmiddellijk met een vloeiende transitie uit uw schermraster, zonder dat de pagina volledig opnieuw hoeft te laden.

---

## Interface van de Boodschappenlijst

De boodschappenomgeving maakt gebruik van een minimalistische en overzichtelijke lijst-indeling, waardoor de tekst ook op mobiele schermen met een lagere helderheid perfect leesbaar blijft.

![Boodschappenoverzicht](../../../assets/images/user-boodschappen.jpeg)

*Figuur 8. De digitale boodschappenlijst van het SuriHealth platform.*

:::note
Mocht uw boodschappenlijst volledig leeg zijn, dan toont de interface een gecentreerd paneel met de melding *"Uw boodschappenlijst is momenteel leeg"*. Zodra u een nieuw menu genereert of een recept selecteert, kunt u de lijst direct weer vullen met de benodigde ingrediënten.
:::

:::caution
Zorg ervoor dat uw browser beschikt over een actieve netwerkverbinding wanneer u items afvinkt in de winkel. Mocht de server onbereikbaar zijn, dan blokkeert de interface de mutatie tijdelijk om te voorkomen dat er items van uw scherm verdwijnen die nog niet succesvol in de database zijn verwerkt.
:::