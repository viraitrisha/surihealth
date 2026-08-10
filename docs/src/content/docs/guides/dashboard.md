---
title: Het Gezondheidsdashboard
description: Overzicht van de realtime planners, gepersonaliseerde receptenrijen en de automatische dagplanner van SuriHealth.
---

Het dashboard fungeert als de centrale, gepersonaliseerde cockpit van het SuriHealth platform. Zodra u inlogt, haalt de server via de loader direct al uw medische restricties en actieve dieetvlaggen op. De interface past zich hier direct op aan en toont uitsluitend gerechten die 100% veilig zijn bevonden voor uw gezondheidsprofiel.

---

## Onderdelen van het Dashboard

Het dashboard is opgebouwd uit vier functionele elementen die naadloos onder elkaar zijn georganiseerd om visuele overlappingen te voorkomen:

### 1. SuriHealth Introductie Banner
Bovenaan de pagina vindt u een beknopt, informatief welkomstscherm. Dit paneel vervangt de traditionele welkomstkaarten en toont direct basisinformatie over verantwoorde Surinaamse voedingskeuzes, evenals actieve statusindicatoren voor uw gezondheids- en smaakprofiel.

### 2. Automatische Dagplanner
Dit paneel stelt direct een volledig, medisch uitgebalanceerd dagmenu voor u samen bestaande uit 5 specifieke maaltijdmomenten: **Ontbijt, Lunch, Warme Middagmaaltijd, Avondeten en een Gezonde Snack**.
- **Live Energie-evaluatie**: Het algoritme controleert runtime of de maaltijden binnen uw berekende Harris-Benedict kcal-budget vallen.
- **Menu Husselen**: Bevalt een van de maaltijden u niet? Klik op de knop **Menu Husselen**. De backend-functie `getAutomaticDailyMenu` trekt direct een splinternieuwe, gerandomiseerde pool van toegestane recepten uit de database zonder uw filters te breken.

### 3. Top Picks Carrousel
Een horizontaal scrollbare, compacte slider die de meest populaire en hooggewaardeerde Surinaamse gerechten toont die specifiek matchen met uw actieve profiel. De carrousel maakt gebruik van native scroll-snapping en verbergt de scrollbalken om een rustig en modern interfacebeeld te garanderen.

### 4. Gepersonaliseerde Surinaamse Keuken
Onder de carrousel vindt u de specifieke categorie-rijen gesorteerd per maaltijdtype (Ontbijtinspiratie, Lichte Lunch, Warme Middagmaaltijd, Verantwoord Avondeten, en Snacks & Desserts). 
- **Volautomatische Filtering**: Elk gerecht binnen deze grids is via `recipeFilters.ts` al gecontroleerd op basis van uw biometrische waarden, allergenen en medische restricties (zoals zoutarm/natriumvrij voor hoge bloeddruk).

---

## Navigeren en Koken vanaf het Dashboard

Volg de onderstaande richtlijnen om maaltijden in te zien of dieper door de database te navigeren:

- **Bekijk Gerecht / Kook Nu**: Klik op de link onderaan een receptenkaart om direct door te schakelen naar de specifieke detailpagina van dat gerecht. Hier vindt u de exacte ingrediëntenhoeveelheden en stapsgewijze bereidingsinstructies.
- **Bekijk Alles**: Klik op de link rechtsboven bij een specifieke maaltijdrij (bijv. bij Lichte Lunch). De applicatie stuurt u direct type-safe door naar de route `/dashboard/category?mealType=lunch`. Een handmatige JSONB-array parser filtert hier direct de volledige database, zodat u een overzicht krijgt van *alle* medisch goedgekeurde lunches.

---

## Interface van het Consumenten Dashboard

Het dashboard maakt gebruik van responsive Tailwind-grids die automatisch meespatten op computers, tablets en smartphones.

![Consumenten Dashboard](../../../assets/images/user-dashboard.jpeg)

*Figuur 4. Dashboard-interface van het SuriHealth platform.*

:::note
Mochten bepaalde maaltijdrijen niet verschijnen op uw dashboard, dan betekent dit dat er op basis van uw strenge combinatie van allergieën en medische aandoeningen momenteel geen gerechten in die specifieke database-categorie matchen. Het systeem verbergt lege rijen automatisch om lay-outgaten te voorkomen.
:::

:::tip
Wilt u de nauwkeurigheid van de getoonde gerechten of uw dagelijkse caloriebehoefte aanpassen? Navigeer dan via de hoofdnavigatiebalk naar de pagina [Gezondheidsprofiel Wijzigen](/guides/profiel/) om uw intake-vragenlijst realtime bij te werken.
:::