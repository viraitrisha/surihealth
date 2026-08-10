---
title: Eerste Keer Opstarten
description: Leer in 5 minuten hoe u de basissystemen, planners en medische filters van SuriHealth gebruikt.
---

Welkom bij SuriHealth. Deze beknopte gids helpt u om binnen 5 minuten volledig operationeel te zijn binnen uw persoonlijke, medisch verantwoorde maaltijomgeving. Volg de onderstaande drie stappen om uw eerste gepersonaliseerde Surinaamse dagmenu te genereren.

---

## Stap 1: Account Aanmaken en Inloggen

Voordat het filtersysteem geactiveerd kan worden, heeft de applicatie een beveiligd account nodig om uw gegevens af te schermen:
1. Navigeer in uw browser naar `http://localhost:3000`.
2. Klik in de navigatiebalk rechtsboven op **Registreren** en vul uw naam, e-mailadres en een sterk wachtwoord in.
3. Klik op **Registreer**. De ingebouwde `/signup` handler maakt uw account aan en logt u direct automatisch in via Better Auth tokens.

:::tip
Als u de applicatie wilt testen met volledige beheerdersrechten (Admin), log dan in met de gereserveerde inloggegevens `surihealth@gmail.com` en het wachtwoord `surihealth123`. De server kent u dan direct de beheerdersrol toe.
:::

---

## Stap 2: Gezondheidsprofiel Invullen

Direct na uw registratie opent de profiel-setup. Uw biometrische startwaarden zijn essentieel voor de achterliggende calculatiematrix:

| Invoerveld | Fysiologische Functie binnen het Systeem |
| :--- | :--- |
| **Leeftijd, Lengte & Gewicht** | Bepaalt uw dagelijkse energiebehoefte (BMR) via de Harris-Benedict formule. |
| **Geregistreerde Aandoeningen** | Activeert de medische uitsluitingsfilters (bijv. Hoge Bloeddruk of Diabetes). |
| **Systeem Dieetplanners** | Dwingt de database om Gluten-vrij, Lactose-vrij, Vega of Vegan toe te passen. |
| **Allergenen & Voorkeuren** | Verwijdert specifieke ingrediënten (zoals pinda's) permanent uit de menu's. |

:::caution
Vul deze gegevens nauwkeurig in. Het platform gebruikt deze waarden om ingrediënten-arrays (zoals zoutvlees bij hypertensie) realtime te scannen en te blokkeren in de database.
:::

---

## Stap 3: Het Gezondheidsdashboard

Zodra uw intake is opgeslagen, landt u op het centrale dashboard. Hier vindt u drie kernonderdelen die volledig op uw profiel zijn afgestemd:

- **Gepersonaliseerde Surinaamse Keuken**: Onder elkaar verschijnen maaltijdrijen (Ontbijt, Lunch, Warme Middagmaaltijd, Avondeten en Snacks). De recepten die hier getoond worden, zijn via `recipeFilters.ts` al 100% veilig verklaard voor uw gezondheid.
- **Automatische Dagplanner**: Bovenaan het dashboard staat een kant-en-klaar menu voor de gehele dag. Het systeem berekent live of de maaltijden binnen uw energie- en natriumbudget passen. Klik op **Menu Husselen** om direct een nieuwe, veilige variatie te genereren.
- **Top Picks voor Jou**: Een horizontaal scrollbare carrousel met de meest populaire en verantwoorde gerechten die specifiek matchen met uw smaakprofiel.

---

## Veelgestelde Vragen (FAQ)

<details>
<summary>Hoe betrouwbaar is de calorieënteller bij Surinaamse recepten?</summary>
De ingebouwde calorieënmotor scant de ingrediënten-arrays runtime. Het bevat een ontdubbelaar die voorkomt dat ingrediënten dubbel worden geteld door vertalingen (zoals Kip en Chicken), waardoor u een zeer nauwkeurige schatting krijgt.
</details>

<details>
<summary>Wat gebeurt er als ik mijn gezondheidsprofiel aanpas?</summary>
Zodra u uw profiel bewerkt en opslaat, wist de applicatie direct de oude browser-caches. De server herberekent uw caloriebehoefte en past de filters op het dashboard onmiddellijk aan.
</details>

---

## Volgende Stappen

Nu u de basis onder de knie heeft, kunt u dieper in de functionaliteiten duiken:
- [De Medische Vragenlijst begrijpen](/guides/vragenlijst/)
- [Navigeren door Maaltijd Categorieën](/guides/categories/)
- [Uw Boodschappenlijst beheren](/guides/boodschappenlijst/)