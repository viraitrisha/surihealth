---
title: Contact Opnemen & FAQ
description: Handleiding voor de ingebouwde helpdesk, het indienen van supportformulieren en het raadplegen van de veelgestelde vragen.
---

Het contact- en FAQ-centrum biedt gebruikers een directe communicatielaag met het beheerteam van SuriHealth. Het systeem combineert een statisch, gecategoriseerd informatiematrix (Veelgestelde Vragen) met een realtime, beveiligd helpdeskformulier dat direct gekoppeld is aan de PostgreSQL-database.

---

## Het Contactformulier Gebruiken

Mocht u een specifieke vraag hebben over uw medische maaltijdplanner, een technisch probleem ervaren, of feedback willen insturen, dan kunt u gebruikmaken van het ingebouwde communicatiepaneel:

### 1. Invoeren van Gegevens
Vul de verplichte velden in het formulier nauwkeurig in:
- **Naam**: Uw voornaam of volledige naam ter identificatie.
- **E-mailadres**: Het e-mailadres waarop u de reactie van de beheerder wilt ontvangen.
- **Bericht**: Een duidelijke omschrijving van uw vraag of ondersteuningsverzoek.

### 2. Veilige Server-Side Verwerking
Klik op de knop **Verzenden**. Op de achtergrond gebeurt nu het volgende via het TanStack Start framework:
- De invoer wordt direct door de server gevalideerd via een Zod-beveiligingsschema.
- Er wordt een uniek ticket gegenereerd en met een realtime tijdstempel (`createdAt`) opgeslagen in de PostgreSQL-tabel `contacts` via Drizzle ORM.
- Het formulier wordt geleegd en de frontend toont direct een succesbevestiging, zonder dat de pagina volledig hoeft te herladen.

---

## Interface van de Contactpagina

Het helpdeskformulier is overzichtelijk en responsive ontworpen, zodat gebruikers ook onderweg via hun smartphone snel een ticket kunnen inschieten.

![Contactformulier](../../../assets/images/landing-contact.jpeg)

*Figuur 12. De ingebouwde helpdesk-interface van het SuriHealth platform.*

---

## Veelgestelde Vragen (FAQ Matrix)

Het FAQ-paneel biedt directe antwoorden op de meest voorkomende vragen over het gebruik van de applicatie. Dit voorkomt onnodige support-belasting en helpt u direct op weg.

![Veelgestelde Vragen](../../../assets/images/landing-faq.jpeg)

*Figuur 13. Het centrale FAQ-informatiepaneel van het SuriHealth platform.*

### Kernonderwerpen in de FAQ:
- **Medische Veiligheid**: Hoe de `recipeFilters.ts` motor risicovolle ingrediënten (zoals zoutvlees bij hoge bloeddruk) herkent en uitsluit.
- **Calorieberekeningen**: Uitleg over de manier waarop de `calorieCalculator.ts` motor runtime de energetische waarden van Surinaamse ingrediënten schat zonder double-counting.
- **Privacy & Gegevens**: Bevestiging dat uw biometrische waarden en chronische condities cryptografisch zijn afgeschermd achter het Better Auth loginsysteem.

---

:::caution
Het formulier accepteert geen lege velden of berichten korter dan 5 tekens. Mocht de PostgreSQL-database offline zijn of de netwerkverbinding wegvallen, dan blijft de verzendknop geblokkeerd om te voorkomen dat uw supportverzoek in het luchtledige verdwijnt.
:::