---
title: Sessie Veilig Afsluiten
description: Richtlijnen voor het cryptografisch beëindigen van uw actieve inlogsessie en het opschonen van lokale browser-caches.
---

Het correct beëindigen van uw gebruikerssessie is een kritieke stap binnen de beveiligingsketen van SuriHealth. Omdat het platform privacygevoelige persoonsgegevens verwerkt — zoals chronische medische aandoeningen, allergieën en biometrische waarden — voorkomt het actief uitloggen dat onbevoegden toegang krijgen tot uw medische data via openstaande browser-tabbladen.

---

## Stappen om Veilig Uit te Loggen

Volg de onderstaande procedure om uw sessie op een veilige en full-stack verantwoorde manier af te sluiten:

### 1. Lokaliseer de Uitlogknop
De uitlogfunctionaliteit is direct geïntegreerd in de hoofdnavigatiebalk aan de bovenzijde van het scherm (`/dashboard/`). Klik op het menu-item **Instellingen**.

### 2. Activeer de Sessiebeëindiging
Klik op de knop **Uitloggen**. Op de achtergrond triggert dit onmiddellijk een asynchrone beëindigingsketen via de Better Auth core-engine:
- **Server-Side Token Revocation**: Better Auth stuurt een verzoek naar de backend om de actieve sessierij binnen de PostgreSQL-tabel `sessions` per direct te deactiveren en te wissen.
- **Cookie Vernietiging**: Het cryptografisch versleutelde session-token wordt direct en permanent uit de cookie-opslag van uw webbrowser verwijderd.

### 3. Automatische Cache-Opschoning & Redirect
Zodra de server de uitlogactie heeft verwerkt, voert de frontend twee opeenvolgende acties uit:
- **Lokale Reset**: Alle tijdelijke browser-caches (zoals het medische intake-profiel in de `surihealth_profile_cache` van uw `localStorage`) worden direct gewist.
- **Harde Routering**: De TanStack Router verbreekt de toegang tot de beveiligde dashboard-omgeving en stuurt uw browser automatisch terug naar de publieke, anonieme landingspagina (`/`).

---

## Gevolgen van de Sessiebeëindiging

Zodra de sessie succesvol is afgesloten, treedt de rollenbeveiliging en de API-interceptor per direct in werking:

- **Harde Toegangsblokkade**: Mocht iemand proberen om via de geschiedenisknop van de browser terug te navigeren naar `http://localhost:3000/dashboard`, dan herkent de route-loader direct dat er geen geldig session-cookie meer aanwezig is. De server weigert het verzoek onmiddellijk en dwingt een automatische omleiding af naar het inlogscherm.
- **Gegevensbescherming**: Na het uitloggen zijn uw medische maaltijdplanners, de automatische dagplanner en uw digitale boodschappenlijst volledig afgeschermd totdat er opnieuw succesvol wordt ingelogd met de juiste inloggegevens.

:::note
Als u gebruikmaakt van een openbare computer of een gedeeld mobiel apparaat (zoals in een bibliotheek, internetcafé of ziekenhuisomgeving), is het actief doorlopen van deze uitlogprocedure uw belangrijkste verdedigingslinie om uw medische privacy te waarborgen conform de AVG-wetgeving.
:::

:::caution
Het simpelweg sluiten van het browsertabblad is **niet voldoende** om uw account direct te vergrendelen als u tijdens het inloggen de optie *Onthoud mijn gegevens* heeft aangevinkt. In dat geval blijft het session-cookie actief in de browser totdat de vervaldatum wordt bereikt, of totdat u handmatig op de knop **Uitloggen** klikt.
:::