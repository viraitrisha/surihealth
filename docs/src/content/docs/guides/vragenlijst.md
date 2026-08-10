---
title: Medische Vragenlijst
description: Richtlijnen voor het configureren van uw biometrische, dieet- en allergische filters binnen de profiel-setup.
---

Direct na de registratie, of wanneer u uw instellingen handmatig wilt bijwerken, opent de profiel-setup van SuriHealth. Deze interface fungeert als de medische intake-laag van het platform. De ingevoerde waarden sturen direct de achterliggende SQL-filtermatrix (`recipeFilters.ts`) aan om een veilige kookomgeving te garanderen.

---

## Structuur van het Intake-Paneel

Om de invoer overzichtelijk te houden, is de medische vragenlijst opgedeeld in drie functionele, interactieve tabbladen. U kunt vrij tussen deze tabbladen wisselen zonder gegevens te verliezen:

### 1. Identiteit & Biometrie
In dit eerste gedeelte voert u uw fysieke basiswaarden in. Deze zijn cruciaal voor de fysiologische berekeningen:
- **Gebruikersnaam**: Uw weergavenaam op het platform.
- **Leeftijd, Lengte & Gewicht**: Deze waarden worden gekoppeld aan de Harris-Benedict formule om uw basale metabolisme (BMR) en dagelijkse energiebehoefte in kilocalorieën (kcal) te berekenen.
- **Geslacht**: Nodig voor de genderspecifieke correctiefactor binnen de calorieën-calculatiematrix.

### 2. Medische Restricties & Diëten
Dit is het meest kritieke onderdeel van de vragenlijst, waarin u uw medische profiel activeert. De keuzes die u hier aanvinkt, sturen de database-filters direct aan:
- **Geregistreerde Aandoeningen**: Vink aan of u te maken heeft met *Diabetes (Suikerziekte)*, *Hoge Bloeddruk*, *Cholesterol* of *Hart- en vaatziekten*. 
- **Systeem Dieetplanners**: Activeer specifieke dieetstijlen zoals *Vegetarisch*, *Veganistisch*, *Gluten-vrij*, *Lactose-vrij* of een algemeen *Zoutarm* dieet.
- **Allergenen Filters**: Geef specifieke voedselallergieën op, zoals *Pinda's / Noten*, *Zuivel*, of *Schelpdieren (Garnalen/Krab)*.

### 3. Smaak Filters & Voorkeuren
Hier kunt u uw culinaire voorkeuren verfijnen op basis van basiselementen uit de Surinaamse keuken (zoals kip, bakkeljauw, kouseband of sopropo):
- **Wat eet u graag?**: Recepten met deze ingrediënten krijgen een hogere prioriteit en verschijnen sneller in uw carrousels.
- **Wat vermijdt u liever?**: Ingrediënten die u hier selecteert, worden via een string-matcher direct en permanent uit uw menu-overzichten gefilterd.

---

## Het Profiel Opslaan en Activeren

Volg de onderstaande stappen om uw intake succesvol te verwerken in het systeem:

1. Controleer of u alle relevante velden en medische vlaggen correct heeft ingevuld.
2. Klik onderaan de pagina op de knop **Profiel Opslaan & Herberekenen**.
3. Op de achtergrond gebeurt nu het volgende via de `/setup` interceptor van de server:
   - **PostgreSQL Opslag**: Drizzle ORM voert een `onConflictDoUpdate` uit. Dit betekent dat uw oude profiel-rij in de database direct wordt overschreven met de allernieuwste waarden.
   - **Cache Opschoning**: De browser wist direct de verouderde gegevens-caches. 
   - **Live Herberekening**: De server herberekenen uw BMI-waarde en caloriebehoefte en stuurt u direct door naar het dashboard, dat nu direct 100% medisch is gefilterd.

:::note
Het platform bevat een visuele Gezondheidsindex (een gekleurde cirkel-grafiek). Elke medische conditie of allergie die u inschakelt, berekent direct een risico-strafpunt mee, waardoor u direct kunt zien hoe streng het systeem uw recepten filtert op dieetveiligheid.
:::

:::caution
Als u de optie *Geen* selecteert bij aandoeningen of allergenen, worden alle eerdere medische filters voor dat specifieke veld uitgeschakeld. Gebruik dit veld alleen als uw gezondheidssituatie volledig is veranderd.
:::