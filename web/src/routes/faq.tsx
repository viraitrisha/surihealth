import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/faq')({
  component: FaqPage,
})

// ────────────────────────────────────────────────────────
//  Category navigation (anchor links)
// ────────────────────────────────────────────────────────
const categories = [
  { id: 'algemeen',  label: 'Algemene Vragen' },
  { id: 'account',   label: 'Account & Profiel' },
  { id: 'recepten',  label: 'Recepten & Functionaliteit' },
  { id: 'gezondheid',label: 'Gezondheid & Dieet' },
  { id: 'technisch', label: 'Technische Vragen' },
  { id: 'support',   label: 'Support & Contact' },
]

// ────────────────────────────────────────────────────────
//  FAQ content per category
// ────────────────────────────────────────────────────────
const faqData: Record<string, { q: string; a: string }[]> = {
  algemeen: [
    {
      q: 'Wat is SuriHealth precies?',
      a: 'SuriHealth is een persoonlijke maaltijdplanner speciaal voor Surinaamse recepten. We helpen je recepten te vinden die passen bij jouw medische condities, allergieën en voorkeuren zodat je zorgeloos kunt genieten van authentiek Surinaams eten.',
    },
    {
      q: 'Is SuriHealth gratis?',
      a: 'Ja, je kunt een gratis account aanmaken en toegang krijgen tot een groot deel van onze recepten en functionaliteiten. We bieden ook een premium abonnement aan met extra functies zoals onbeperkte weekmenu’s en geavanceerde filters.',
    },
    {
      q: 'Voor wie is SuriHealth bedoeld?',
      a: 'Voor iedereen die van Surinaams eten houdt maar rekening moet houden met hun gezondheid. Denk aan mensen met diabetes, hart- en vaatziekten, voedselallergieën, lactose-intolerantie, of andere dieetbeperkingen.',
    },
  ],
  account: [
    {
      q: 'Hoe maak ik een account aan?',
      a: 'Klik op “REGISTREER NU” op de homepage, vul je e-mailadres in, kies een wachtwoord en beantwoord enkele vragen over je gezondheid en voorkeuren. Dit duurt ongeveer 5 minuten.',
    },
    {
      q: 'Kan ik mijn gezondheidsinformatie later aanpassen?',
      a: 'Ja, je kunt altijd teruggaan naar je profiel en je medische condities, allergieën of voorkeuren aanpassen. De receptensuggesties worden automatisch bijgewerkt.',
    },
    {
      q: 'Is mijn gezondheidsinformatie veilig?',
      a: 'Absoluut. We slaan je gezondheidsgegevens versleuteld op en delen deze nooit met derden zonder je uitdrukkelijke toestemming. Lees ons privacybeleid voor meer informatie.',
    },
  ],
  recepten: [
    {
      q: 'Zijn jullie recepten aangepast of gezonder gemaakt?',
      a: 'Nee, wij gebruiken authentieke Surinaamse recepten en filteren alleen welke recepten geschikt zijn voor jouw profiel. De gerechten blijven zoals je ze kent, maar zijn wel veilig voor jou.',
    },
    {
      q: 'Hoe werkt de automatische receptenselectie?',
      a: 'Na het invullen van je profiel bepaalt het systeem automatisch welke recepten bij jou passen. Je kunt kiezen voor een volledig automatisch weekmenu of zelf handmatig recepten selecteren uit de gefilterde lijst.',
    },
    {
      q: 'Kan ik ook handmatig recepten zoeken?',
      a: 'Ja, je kunt zoeken op ingrediënt, bereidingstijd, calorieën, type gerecht (ontbijt, lunch, diner) en nog veel meer.',
    },
  ],
  gezondheid: [
    {
      q: 'Zijn jullie recepten medisch goedgekeurd?',
      a: 'SuriHealth is een studentenproject en biedt geen medisch advies. Raadpleeg altijd je arts of diëtist voor persoonlijk medisch advies.',
    },
    {
      q: 'Ik heb meerdere medische condities. Kan SuriHealth daarmee omgaan?',
      a: 'Ja, je kunt meerdere aandoeningen en allergieën selecteren. Het systeem houdt rekening met alle combinaties.',
    },
    {
      q: 'Wordt rekening gehouden met religieuze dieetwensen?',
      a: 'Ja, je kunt aangeven of je halal, vegetarisch, veganistisch of andere dieetvoorkeuren hebt. Deze worden meegenomen in de filtering.',
    },
    {
      q: 'Kunnen jullie helpen bij gewichtsverlies?',
      a: 'We tonen voedingswaarden en calorieën per recept, maar een persoonlijk dieetplan voor gewichtsverlies moet je met een diëtist bespreken.',
    },
  ],
  technisch: [
    {
      q: 'Op welke apparaten werkt SuriHealth?',
      a: 'SuriHealth werkt op alle moderne browsers en is geoptimaliseerd voor desktop, tablet en smartphone.',
    },
    {
      q: 'Werkt SuriHealth offline?',
      a: 'Je kunt opgeslagen recepten en boodschappenlijstjes offline bekijken, maar een actieve internetverbinding is nodig om nieuwe data op te halen.',
    },
    {
      q: 'Hoe vaak wordt de receptendatabase bijgewerkt?',
      a: 'We voegen maandelijks nieuwe recepten toe en controleren bestaande recepten op actualiteit.',
    },
  ],
  support: [
    {
      q: 'Hoe kan ik contact opnemen?',
      a: 'Via het contactformulier op de contactpagina of door een e-mail te sturen naar support@surihealth.nl.',
    },
    {
      q: 'Kunnen jullie helpen met medische vragen?',
      a: 'Voor medische vragen verwijzen wij je altijd naar je behandelend arts of een gekwalificeerde zorgverlener.',
    },
    {
      q: 'Accepteren jullie feedback?',
      a: 'Zeker! Jouw feedback helpt ons SuriHealth verder te verbeteren. Gebruik het contactformulier om suggesties door te geven.',
    },
  ],
}

// ────────────────────────────────────────────────────────
//  Page component
// ────────────────────────────────────────────────────────
function FaqPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      {/* Titel */}
      <h1 className="text-center text-4xl font-bold border-b-[5px] border-[var(--black-color)] pb-4 mb-12">
        Veelgestelde Vragen
      </h1>

      {/* Categorie navigatie */}
      <nav className="mb-16">
        <ul className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <a
                href={`#${cat.id}`}
                className="block px-6 py-3 rounded-lg font-semibold text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 transition"
              >
                {cat.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* FAQ secties */}
      <div className="space-y-16">
        {categories.map(({ id }) => {
          const items = faqData[id]
          if (!items) return null
          return (
            <section key={id} id={id} className="scroll-mt-(--header-height)">
              <h2 className="text-center text-2xl font-bold border-b-[5px] border-[var(--black-color)] pb-3 mb-8">
                {categories.find((c) => c.id === id)?.label}
              </h2>

              {items.map((item) => (
                <details
                  key={item.q}
                  className="mb-6 shadow-[var(--box-shadow)] rounded-lg overflow-hidden group"
                >
                  <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-semibold p-6 flex items-center justify-between transition-colors after:content-['▼'] after:transition-transform group-open:after:rotate-180">
                    {item.q}
                  </summary>
                  <div className="p-6 text-[var(--accent-color)] bg-[var(--white-color)]">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </section>
          )
        })}
      </div>

      {/* Call to action */}
      <div className="mt-16 text-center">
        <Link
          to="/contact"
          className="inline-block bg-[var(--black-color)] text-[var(--white-color)] px-8 py-4 rounded-lg font-bold text-xl hover:bg-[var(--accent-color)] hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          Heeft u nog meer vragen? Neem contact op met ons!
        </Link>
      </div>
    </main>
  )
}