import { createFileRoute, Link } from '@tanstack/react-router'
import Header from '#/client/components/Layout/PrivateHeader'
import Footer from '#/client/components/Layout/Footer'

export const Route = createFileRoute('/faq')({
  component: FAQPage,
})

function FAQPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen">

        {/* Titel */}
        <section className="py-10 text-center border-b-2 border-[var(--black-color)]">
          <h1 className="text-[3rem] font-bold text-[var(--black-color)]">
            Veelgestelde Vragen
          </h1>
        </section>

        {/* Categorieën */}
        <section className="px-8 py-8 shadow-[var(--box-shadow)]">
          <nav>
            <ul className="flex flex-wrap justify-center gap-2 list-none">

              <li>
                <a
                  href="#algemeen"
                  className="block px-8 py-4 rounded-lg font-bold text-[var(--primary-color)] transition-all duration-300 hover:text-[var(--secondary-color)] hover:shadow-[var(--box-shadow)]"
                >
                  Algemene Vragen
                </a>
              </li>

              <li>
                <a
                  href="#account"
                  className="block px-8 py-4 rounded-lg font-bold text-[var(--primary-color)] transition-all duration-300 hover:text-[var(--secondary-color)] hover:shadow-[var(--box-shadow)]"
                >
                  Account & Profiel
                </a>
              </li>

              <li>
                <a
                  href="#recepten"
                  className="block px-8 py-4 rounded-lg font-bold text-[var(--primary-color)] transition-all duration-300 hover:text-[var(--secondary-color)] hover:shadow-[var(--box-shadow)]"
                >
                  Recepten & Functionaliteit
                </a>
              </li>

              <li>
                <a
                  href="#gezondheid"
                  className="block px-8 py-4 rounded-lg font-bold text-[var(--primary-color)] transition-all duration-300 hover:text-[var(--secondary-color)] hover:shadow-[var(--box-shadow)]"
                >
                  Gezondheid & Dieet
                </a>
              </li>

              <li>
                <a
                  href="#technisch"
                  className="block px-8 py-4 rounded-lg font-bold text-[var(--primary-color)] transition-all duration-300 hover:text-[var(--secondary-color)] hover:shadow-[var(--box-shadow)]"
                >
                  Technische Vragen
                </a>
              </li>

              <li>
                <a
                  href="#support"
                  className="block px-8 py-4 rounded-lg font-bold text-[var(--primary-color)] transition-all duration-300 hover:text-[var(--secondary-color)] hover:shadow-[var(--box-shadow)]"
                >
                  Support & Contact
                </a>
              </li>

            </ul>
          </nav>
        </section>

        <section className="px-10 py-8 space-y-12">

          {/* ALGEMEEN */}
          <section id="algemeen" className="scroll-mt-48">

            <h2 className="text-center text-[2.2rem] font-bold border-b-[5px] border-[var(--black-color)] pb-3 mb-8 text-[var(--black-color)]">
              Algemene Vragen
            </h2>

            <details className="mb-8 shadow-[var(--box-shadow)] overflow-hidden">

              <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold px-8 py-6 transition-colors duration-300">
                Wat is SuriHealth precies?
              </summary>

              <div className="px-8 py-6 text-[var(--accent-color)]">
                <p>
                  SuriHealth is een persoonlijke maaltijdplanner speciaal voor
                  Surinaamse recepten. We helpen je recepten te vinden die passen
                  bij jouw medische condities, allergieën en voorkeuren zodat je
                  zorgeloos kunt genieten van authentiek Surinaams eten.
                </p>
              </div>

            </details>

            <details className="mb-8 shadow-[var(--box-shadow)] overflow-hidden">

              <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold px-8 py-6 transition-colors duration-300">
                Is SuriHealth gratis?
              </summary>

              <div className="px-8 py-6 text-[var(--accent-color)]">
                <p>
                  Ja. Je kunt gratis een account aanmaken en gebruikmaken van een
                  groot deel van de recepten en functionaliteiten. Daarnaast is
                  er een premium abonnement beschikbaar met extra mogelijkheden.
                </p>
              </div>

            </details>

            <details className="mb-8 shadow-[var(--box-shadow)] overflow-hidden">

              <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold px-8 py-6 transition-colors duration-300">
                Voor wie is SuriHealth bedoeld?
              </summary>

              <div className="px-8 py-6 text-[var(--accent-color)]">
                <p>
                  Voor iedereen die van Surinaams eten houdt maar rekening moet
                  houden met allergieën, diabetes, hart- en vaatziekten of andere
                  dieetbeperkingen.
                </p>
              </div>

            </details>

          </section>

          {/* ACCOUNT */}
          <section id="account" className="scroll-mt-48">

            <h2 className="text-center text-[2.2rem] font-bold border-b-[5px] border-[var(--black-color)] pb-3 mb-8 text-[var(--black-color)]">
              Account & Profiel
            </h2>

            <details className="mb-8 shadow-[var(--box-shadow)] overflow-hidden">

              <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold px-8 py-6 transition-colors duration-300">
                Hoe maak ik een account aan?
              </summary>

              <div className="px-8 py-6 text-[var(--accent-color)]">
                <p>
                  Klik op <strong>Registreer Nu</strong>, vul je e-mailadres in,
                  kies een wachtwoord en beantwoord enkele vragen over je
                  gezondheid en voorkeuren.
                </p>
              </div>

            </details>

            <details className="mb-8 shadow-[var(--box-shadow)] overflow-hidden">

              <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold px-8 py-6 transition-colors duration-300">
                Kan ik mijn gezondheidsinformatie later aanpassen?
              </summary>

              <div className="px-8 py-6 text-[var(--accent-color)]">
                <p>
                  Ja. Je kunt altijd je profiel aanpassen. De receptsuggesties
                  worden daarna automatisch bijgewerkt.
                </p>
              </div>

            </details>

            <details className="mb-8 shadow-[var(--box-shadow)] overflow-hidden">

              <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold px-8 py-6 transition-colors duration-300">
                Is mijn gezondheidsinformatie veilig?
              </summary>

              <div className="px-8 py-6 text-[var(--accent-color)]">
                <p>
                  Ja. Je gegevens worden veilig opgeslagen en niet gedeeld zonder
                  jouw toestemming.
                </p>
              </div>

            </details>

          </section>

          {/* RECEPTEN */}
          <section id="recepten" className="scroll-mt-48">

            <h2 className="text-center text-[2.2rem] font-bold border-b-[5px] border-[var(--black-color)] pb-3 mb-8 text-[var(--black-color)]">
              Recepten & Functionaliteit
            </h2>
            <details className="mb-8 shadow-[var(--box-shadow)] overflow-hidden">
              <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold px-8 py-6 transition-colors duration-300">
                Zijn jullie recepten aangepast of gezonder gemaakt?
              </summary>

              <div className="px-8 py-6 text-[var(--accent-color)]">
                <p>
                  Nee. Wij gebruiken authentieke Surinaamse recepten en filteren
                  alleen welke recepten geschikt zijn voor jouw profiel.
                </p>
              </div>
            </details>

            <details className="mb-8 shadow-[var(--box-shadow)] overflow-hidden">
              <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold px-8 py-6 transition-colors duration-300">
                Hoe werkt de automatische receptenselectie?
              </summary>

              <div className="px-8 py-6 text-[var(--accent-color)]">
                <p>
                  Na het invullen van je profiel bepaalt het systeem welke
                  recepten geschikt zijn. Je kunt zelf kiezen of automatisch een
                  weekmenu laten samenstellen.
                </p>
              </div>
            </details>

            <details className="mb-8 shadow-[var(--box-shadow)] overflow-hidden">
              <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold px-8 py-6 transition-colors duration-300">
                Kan ik ook handmatig recepten zoeken?
              </summary>

              <div className="px-8 py-6 text-[var(--accent-color)]">
                <p>
                  Ja. Je kunt zoeken op ingrediënt, bereidingstijd, calorieën en
                  type gerecht.
                </p>
              </div>
            </details>

          </section>

          {/* GEZONDHEID */}
          <section id="gezondheid" className="scroll-mt-48">

            <h2 className="text-center text-[2.2rem] font-bold border-b-[5px] border-[var(--black-color)] pb-3 mb-8 text-[var(--black-color)]">
              Gezondheid & Dieet
            </h2>

            {[
              [
                "Zijn jullie recepten medisch goedgekeurd?",
                "SuriHealth is een studentenproject en biedt geen medisch advies. Raadpleeg altijd je arts of diëtist.",
              ],
              [
                "Ik heb meerdere medische condities. Kan SuriHealth daarmee omgaan?",
                "Ja, je kunt meerdere aandoeningen en allergieën selecteren.",
              ],
              [
                "Wordt rekening gehouden met religieuze dieetwensen?",
                "Ja. Halal, vegetarisch, veganistisch en andere voorkeuren kunnen worden ingesteld.",
              ],
              [
                "Kunnen jullie helpen bij gewichtsverlies?",
                "We tonen voedingswaarden en calorieën, maar persoonlijk advies moet via een diëtist verlopen.",
              ],
            ].map(([vraag, antwoord]) => (
              <details
                key={vraag}
                className="mb-8 shadow-[var(--box-shadow)] overflow-hidden"
              >
                <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold p-6 transition-colors duration-300">
                  {vraag}
                </summary>

                <div className="p-6 text-[var(--accent-color)]">
                  {antwoord}
                </div>
              </details>
            ))}

          </section>

          {/* TECHNISCH */}
          <section id="technisch" className="scroll-mt-48">

            <h2 className="text-center text-[2.2rem] font-bold border-b-[5px] border-[var(--black-color)] pb-3 mb-8 text-[var(--black-color)]">
              Technische Vragen
            </h2>

            {[
              [
                "Op welke apparaten werkt SuriHealth?",
                "Desktop, tablet en smartphone worden ondersteund.",
              ],
              [
                "Werkt SuriHealth offline?",
                "Opgeslagen recepten en boodschappenlijsten zijn offline beschikbaar.",
              ],
              [
                "Hoe vaak wordt de receptendatabase bijgewerkt?",
                "Maandelijks worden nieuwe recepten toegevoegd en bestaande bijgewerkt.",
              ],
            ].map(([vraag, antwoord]) => (
              <details
                key={vraag}
                className="mb-8 shadow-[var(--box-shadow)] overflow-hidden"
              >
                <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold p-6 transition-colors duration-300">
                  {vraag}
                </summary>

                <div className="p-6 text-[var(--accent-color)]">
                  {antwoord}
                </div>
              </details>
            ))}

          </section>

          {/* SUPPORT */}
          <section id="support" className="scroll-mt-48">

            <h2 className="text-center text-[2.2rem] font-bold border-b-[5px] border-[var(--black-color)] pb-3 mb-8 text-[var(--black-color)]">
              Support & Contact
            </h2>

            {[
              [
                "Hoe kan ik contact opnemen?",
                "Via het contactformulier of support@surihealth.nl.",
              ],
              [
                "Kunnen jullie helpen met medische vragen?",
                "Voor medische vragen verwijzen wij naar je arts of zorgverlener.",
              ],
              [
                "Accepteren jullie feedback?",
                "Ja, feedback helpt ons om SuriHealth te verbeteren.",
              ],
            ].map(([vraag, antwoord]) => (
              <details
                key={vraag}
                className="mb-8 shadow-[var(--box-shadow)] overflow-hidden"
              >
                <summary className="cursor-pointer bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--white-color)] font-bold p-6 transition-colors duration-300">
                  {vraag}
                </summary>

                <div className="p-6 text-[var(--accent-color)]">
                  {antwoord}
                </div>
              </details>
            ))}

          </section>

        </section>

        <section className="py-16 text-center">

          <Link
            to="/questions"
            className="inline-block px-8 py-4 rounded-lg font-bold bg-[var(--black-color)] text-[var(--white-color)] transition-all duration-300 hover:bg-[var(--accent-color)] hover:shadow-[var(--box-shadow)] hover:-translate-y-[3px]"
          >
            Heeft u nog meer vragen? Neem contact op met ons!
          </Link>

        </section>

      </main>

      <Footer />
    </>
  )
}