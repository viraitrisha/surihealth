---
title: Maaltijd Categorieën
description: Navigeren door de specifieke, gepersonaliseerde Surinaamse keuken per maaltijdtype.
---

Wanneer u op het dashboard specifieke inspiratie zoekt voor een bepaald moment van de dag, kunt u doorklikken naar de maaltijd categoriepagina. In tegenstelling tot de algemene database catalogus, toont deze pagina uitsluitend de recepten van één specifiek type die bovendien 100% veilig zijn bevonden voor uw actieve gezondheidsprofiel.

---

## Type-Safe Routering

Wanneer u op het hoofd-dashboard (`/dashboard`) bij een specifieke maaltijdrij (zoals Lichte Lunch of Ontbijt Inspiratie) op de link **Bekijk alles** klikt, activeert het TanStack Start framework een type-safe navigatie-aanroep. 

De applicatie stuurt u door naar een speciale route inclusief een specifieke query-parameter, bijvoorbeeld:
- `http://localhost:3000/dashboard/category?mealType=ontbijt`
- `http://localhost:3000/dashboard/category?mealType=lunch`
- `http://localhost:3000/dashboard/category?mealType=middagmaaltijd`
- `http://localhost:3000/dashboard/category?mealType=avondeten`
- `http://localhost:3000/dashboard/category?mealType=dessert`

---

## Werking van de Server-Side Loader

Zodra de URL wordt aangeroepen, treedt de specifieke route-loader van `category.tsx` in werking om de weergave foutloos op te bouwen:

1. **Parameter Validatie**: De `validateSearch` methode van TanStack Router vangt de parameter op. Mocht de parameter corrupt zijn of ontbreken, dan valt de pagina automatisch en veilig terug op het standaardtype `'lunch'`.
2. **Gefilterde Database Aanvraag**: De loader roept de server-function `getRecipes` aan en geeft de gezochte `mealType` direct mee binnen de data-payload.
3. **Case-Insensitive Array Parsing**: Recepten in de PostgreSQL-database bevatten soms wisselende schrijfwijzen (zoals `"Lunch"`, `"avondeten"` of `"Ontbijt"`). De server-function en frontend-filters zetten alle strings runtime om naar kleine letters (`.toLowerCase().trim()`). Dit voorkomt data-overlappingen en zorgt ervoor dat er nooit recepten per ongeluk onzichtbaar blijven.

---

## Dynamische Interface & Headers

De categoriepagina past zijn interface-elementen (titels en vector-iconen) automatisch aan op basis van het gekozen maaltijdtype:

- **Ontbijt**: Toont een koffiekop-icoon met de titel *Mijn Gefilterde Ontbijtopties*.
- **Lunch**: Toont een gelaagd panelen-icoon met de titel *Mijn Gefilterde Lunchgerechten*.
- **Middagmaaltijd**: Toont een zongecentreerd icoon met de titel *Mijn Gefilterde Middagmaaltijden*.
- **Avondeten**: Toont een maan-icoon met de titel *Mijn Gefilterde Avondmaaltijden*.
- **Dessert & Snacks**: Toont een koekjes-icoon met de titel *Mijn Gefilterde Snacks & Desserts*.

---

## Het Recepten Grid Matrix Overzicht

De goedgekeurde gerechten worden gepresenteerd in een overzichtelijke grid-indeling (vier kolommen op desktop). Elke receptenkaart beschikt over een directe koppeling naar de specifieke detailpagina (`/dashboard/recipes/view/$recipeId`).

:::note
Mocht u de melding *"Geen gerechten gevonden voor deze categorie die matchen met uw actieve dieetbeperkingen"* in beeld krijgen, dan betekent dit dat de medische filter (`recipeFilters.ts`) alle gerechten binnen dit maaltijdtype heeft moeten blokkeren voor uw veiligheid (bijvoorbeeld omdat alle beschikbare ontbijtopties natrium bevatten terwijl u op een zoutarm dieet staat).
:::

:::tip
Gebruik de terugknop linksboven (*Terug naar dashboard*) om direct en zonder laadvertragingen terug te keren naar uw centrale cockpit. Dankzij de ingebouwde state-caches van de router hoeft de browser de hoofdpagina niet volledig opnieuw op te bouwen.
:::