---
title: Recept Details & Instructies
description: Handleiding voor de receptinformatie, de runtime-energiemeter, favorietenbeheer en de geautomatiseerde boodschappen-extractie.
---

De recept-detailpagina (`/dashboard/recipes/view/$recipeId`) vormt de operationele kookomgeving van het SuriHealth platform. Zodra deze specifieke route wordt aangeroepen, laadt de server-side route-loader realtime de volledige specificaties van het gekozen gerecht in, berekent de voedingswaarden en activeert de interactieve actie-componenten.

---

## Anatomie van het Recept-Detailscherm

De detailpagina is opgebouwd uit een overzichtelijke, tweekoloms matrix die zich automatisch aanpast op desktops, tablets en smartphones:

### 1. Visuele Identiteit & Core Metrics Balk
Bovenaan de pagina vindt u de hoofdafbeelding van de maaltijd met daarnaast een gecentreerde statistiekenbalk. Deze balk toont de fysiologische eigenschappen van het gerecht:
- **Energie (Kcal-meter)**: Toont de exacte energetische waarde van de maaltijd, on-the-fly berekend door de `calorieCalculator.ts` motor op basis van de ingrediënten-array. Dit getal communiceert direct met uw dashboard om te controleren of de maaltijd binnen uw dagelijkse Harris-Benedict budget past.
- **Regio & Afkomst**: Geeft de specifieke Surinaamse kookstijl an (bijv. Hindoestaans, Creools, Javaans).
- **Kooktijd**: De gemiddelde bereidingsduur van het gerecht.

### 2. Dynamische Ingrediëntenlijst (Linkerzijde)
- Het systeem scant de database-rij en toont automatisch de Nederlandse vertalingen (`ingredientsNl`) indien aanwezig, of valt veilig terug op de Engelse basisbeschrijving. Elk ingrediënt is voorzien van een strak, groen vector-icoon ter bevestiging van de dieetveiligheid.

### 3. Bereidingswijze & Kookinstructies (Rechterzijde)
- Direct aan de rechterkant van de ingrediëntenkolom bevindt zich een grote, centrale kaart die de volledige bereidingswijze bevat. De kookinstructies en bereidingsstappen uit PostgreSQL worden hier als één overzichtelijk, doorlopend en gestructureerd tekstblok gepresenteerd, zodat de gebruiker tijdens het koken een rustig en helder leesvenster heeft.

---

## Interactieve Acties & Server-Functions

De pagina bevat twee krachtige, asynchrone actieknoppen die direct communiceren met de database via TanStack Start Server Functions:

### 1. Boodschappenlijst Aanmaken
- **Functie**: Klik op de knop **Boodschappenlijst maken**. De applicatie activeert direct een asynchrone lus die de server-function `addShoppingItem` aanroept voor elk ingrediënt uit de lijst. 
- **Resultaat**: Alle benodigde elementen worden direct overgedragen en gecached in uw persoonlijke digitale boodschappenlijst, zonder dat u de pagina handmatig hoeft te verfijnen.

### 2. FavorietenBeheer
- **Functie**: Klik op de knop **Favoriet maken** (voorzien van een interactief hart-icoon). Dit triggert direct de backend-functie `toggleFavorite`.
- **Resultaat**: Het recept-ID wordt in PostgreSQL gekoppeld aan uw gebruikersaccount. De knop kleurt onmiddellijk rood via een live state-updatesysteem om de favorietenstatus visueel te bevestigen. Bij een tweede klik wordt de koppeling direct weer type-safe verbroken.

---

## Interface van de Detailpagina

De detailpagina maakt gebruik van een semi-transparante navigatiekoppeling waarmee u met één klik direct kunt terugkeren naar de receptencatalogus.

![Recept Details](../../../assets/images/user-recipe-details.jpeg)

*Figuur 7. Detail- en bereidingsinterface van het SuriHealth platform.*

---

## Vergelijkbare Recepten

:::note
Onderaan de detailpagina bevindt zich een slimme aanbevelingscarrousel. De loader gebruikt een JavaScript `Set` om de ingrediënten van het huidige gerecht te vergelijken met de rest van de database. Recepten die **minimaal 3 dezelfde basiselementen** delen, worden automatisch gesorteerd en getoond als suggestie. Hierdoor ontdekt u direct verantwoorde Surinaamse variaties met ingrediënten die u al in huis heeft.
:::

:::caution
Wanneer u ingrediënten toevoegt aan uw boodschappenlijst, controleert de applicatie of u verbinding heeft met het internet. Mocht de server offline zijn, dan blijft de laadindicator (`Loader2 animate-spin`) actief om te voorkomen dat er corrupte of onvolledige data in de database wordt weggeschreven.
:::
