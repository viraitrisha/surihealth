# SuriHealth System Documentation Handbook

Dit component bevat de volledige, interactieve systeemdocumentatie en het functionele handboek van het SuriHealth platform. De documentatiewebsite is gebouwd met het Astro Starlight framework en compileert via Static Site Generation (SSG) naar 100% pure HTML, CSS en JavaScript-bestanden voor een veilige en razendsnelle weergave.

---

## Technische Techstack (Architecture)

- **Documentatie Engine**: Astro Starlight Ecosystem
- **Rendering Model**: Static Site Generation (SSG)
- **Content Formaat**: Markdown (.md) & MDX (Markdown met ingebedde React-componenten)
- **Styling Overrides**: CSS Custom Properties & SuriHealth Teal Color Tokens
- **Deployment Platform**: Vercel Static Hosting (Edge CDN distributie)

---

## Systeemvereisten & Voorwaarden (Prerequisites)

Om deze documentatieomgeving lokaal te kunnen compileren, te inspecteren of uit te breiden, dient uw computer te beschikken over de volgende softwareonderdelen:

1. **Node.js Runtime**: Versie `v18.x` of `v20.x` (LTS-versies worden aanbevolen voor optimale prestaties van de Astro compiler).
2. **Package Manager**: `pnpm` (versie 8.x of nuwer) om de dependencies binnen de workspace correct te installeren en te isoleren.
3. **Webbrowser**: Elke up-to-date webbrowser (zoals Google Chrome, Apple Safari of Microsoft Edge) om de lokale weergave te controleren.

---

## Installatiegids (Installation)

Volg deze stappen in uw PowerShell-terminal om de documentatieomgeving lokaal op te bouwen:

### 1. Dependencies installeren
Navigeer specifiek naar de map `docs/` en installeer de vereiste Astro en Starlight pakketten:
```powershell
cd docs
pnpm install
```

### 2. Tijdelijke cache opschonen
Mochten er eerdere weergaven vaststaan in het geheugen, wis dan de tijdelijke build-caches om een schone start te garanderen:
```powershell
Remove-Item -Recurse -Force .astro, dist, node_modules/.vite -ErrorAction Ignore
```

---

## Documentatie Lokaal Gebruik & Beheer (Usage)

U kunt de documentatie lokaal opstarten om te testen, of compileren naar statische bestanden voor deployment via de volgende opdrachten:

### Lokale Ontwikkelomgeving (Development Server)
Start de lokale weergaveserver op om wijzigingen in de Markdown-bestanden realtime live in uw browser te zien:
```powershell
pnpm dev
```
De documentatie is direct lokaal bereikbaar via het toegewezen adres, standaard: `http://localhost:4321`

### Statische Productiebuild Compileren (Production Build)
Om de volledige documentatie om te zetten naar de definitieve, geoptimaliseerde HTML-bestanden die live op Vercel worden gepubliceerd, gebruikt u:
```powershell
pnpm build
```
De resulterende, pure webbestanden worden door de compiler weggeschreven in de map `docs/dist/`.

---

## Structuur en Onderhoud van de Handleidingen

Alle functionele handleidingen, medische filterverklaringen en administratorgidsen zijn opgeslagen als gestructureerde contentbestanden in de map: `src/content/docs/`.
- **`guides/`**: Bevat de gebruikershandleidingen (zoals introductie, dashboard, recepten en profielbeheer).
- **`admin/`**: Bevat de beveiligde beheerdersgidsen (zoals database CRUD en support inbox).
- **Zijbalk Navigatie**: De volgorde en groepering van de menu-items worden centraal en type-safe beheerd binnen het `sidebar` array-object in het bestand `astro.config.mjs`.