---
title: Systeeminstellingen
description: Handleiding voor het beheren van interface-voorkeuren, de automatische i18n-taalvectoren en accountsynchronisatie.
---

De instellingenomgeving (`/dashboard/settings`) biedt gebruikers de mogelijkheid om de visuele weergave en gedragsparameters van het platform af te stemmen op hun persoonlijke voorkeuren. Wijzigingen in dit paneel worden direct via globale state-managers verwerkt om een consistente gebruikerservaring te garanderen.

---

## Beschikbare Systeemconfiguraties

De interface is opgebouwd rondom drie functionele instellingsmodules die de runtime-weergave van de applicatie aansturen:

### 1. Interface Visuele Modus (Thema)
U kunt de globale styling van de schermen handmatig vergrendelen of laten synchroniseren met uw apparaatinstellingen:
- **Lichte Modus (Light)**: Optimaliseert het contrast voor gebruik overdag via heldere, steriele witte achtergronden.
- **Donkere Modus (Dark)**: Schakelt over naar een rustgevende, diepblauwe nachtmodus via `data-theme` manipulatie. Dit minimaliseert vermoeidheid aan de ogen bij gebruik in de avonduren en verlaagt het batterijverbruik op OLED-schermen van smartphones.

### 2. Automatische Taal- & Vertalingsvectoren (i18n)
- **Werking**: Het platform maakt gebruik van een statische i18n-vertaallaag om recepten uit externe bronnen (zoals The MealDB) direct om te zetten.
- **Resultaat**: Ingrediënten en kookinstructies worden automatisch vertaald naar het Nederlands. In de instellingen kunt u de voorkeurstaal voor de weergave beheren, waarbij het systeem bij ontbrekende vertalingen naadloos en type-safe terugvalt op de Engelse brontekst om lege velden te voorkomen.

### 3. Account & Sessiebeheer
- Geeft u direct inzicht in uw actieve Better Auth verbindingsstatus. Vanaf hier kunt u uw ingelogde sessie-tokens controleren, uw wachtwoord veilig wijzigen via versleutelde backend-interceptors, of uw account volledig loskoppelen van het PostgreSQL-netwerk.

---

## Interface van het Instellingenpaneel

Het paneel maakt gebruik van duidelijke keuzemenu's en schakelaars die direct reageren op gebruikersinvoer.

![Systeeminstellingen](../../../assets/images/user-settings.jpeg)

*Figuur 11. Het systeeminstellingen- en voorkeurenvenster van het SuriHealth platform.*

---

:::caution
Het handmatig wissen van uw browsergeschiedenis of sitegegevens kan uw opgeslagen thema- en taalvoorkeuren resetten naar de standaard fabriekswaarden (Lichte modus / Nederlands). Mocht dit gebeuren, open dan simpelweg dit paneel opnieuw om uw voorkeuren met één klik te herstellen.
:::