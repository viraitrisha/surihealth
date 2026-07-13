import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
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
        <section className="py-10 text-center border-b-2 border-black">
          <h1 className="text-[3rem] font-bold text-black">
            Veelgestelde Vragen
          </h1>
        </section>

        {/* Categorieën */}
        <section className="px-8 py-8 shadow-md">
          <nav>
            <ul className="flex flex-wrap justify-center gap-4 list-none">

              <li>
                <a
                  href="#algemeen"
                  className="px-6 py-3 rounded-lg font-bold text-[#1A756A] hover:text-[#2D9C8F] hover:shadow-md transition"
                >
                  Algemene Vragen
                </a>
              </li>

              <li>
                <a
                  href="#account"
                  className="px-6 py-3 rounded-lg font-bold text-[#1A756A] hover:text-[#2D9C8F] hover:shadow-md transition"
                >
                  Account & Profiel
                </a>
              </li>

              <li>
                <a
                  href="#recepten"
                  className="px-6 py-3 rounded-lg font-bold text-[#1A756A] hover:text-[#2D9C8F] hover:shadow-md transition"
                >
                  Recepten & Functionaliteit
                </a>
              </li>

              <li>
                <a
                  href="#gezondheid"
                  className="px-6 py-3 rounded-lg font-bold text-[#1A756A] hover:text-[#2D9C8F] hover:shadow-md transition"
                >
                  Gezondheid & Dieet
                </a>
              </li>

              <li>
                <a
                  href="#technisch"
                  className="px-6 py-3 rounded-lg font-bold text-[#1A756A] hover:text-[#2D9C8F] hover:shadow-md transition"
                >
                  Technische Vragen
                </a>
              </li>

              <li>
                <a
                  href="#support"
                  className="px-6 py-3 rounded-lg font-bold text-[#1A756A] hover:text-[#2D9C8F] hover:shadow-md transition"
                >
                  Support & Contact
                </a>
              </li>

            </ul>
          </nav>
        </section>

        <section className="px-10 py-8 space-y-12">

          {/* ALGEMEEN */}

          <section id="algemeen">

            <h2 className="text-center text-[2.2rem] font-bold border-b-[5px] border-black pb-3 mb-8">
              Algemene Vragen
            </h2>

            <details className="mb-8 shadow-md overflow-hidden">
              <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold px-8 py-6">
                Wat is SuriHealth precies?
              </summary>

              <div className="px-8 py-6 text-[#4B5563]">
                <p>
                  SuriHealth is een persoonlijke maaltijdplanner speciaal voor
                  Surinaamse recepten. We helpen je recepten te vinden die passen
                  bij jouw medische condities, allergieën en voorkeuren zodat je
                  zorgeloos kunt genieten van authentiek Surinaams eten.
                </p>
              </div>
            </details>

            <details className="mb-8 shadow-md overflow-hidden">
              <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold px-8 py-6">
                Is SuriHealth gratis?
              </summary>

              <div className="px-8 py-6 text-[#4B5563]">
                <p>
                  Ja. Je kunt gratis een account aanmaken en gebruikmaken van een
                  groot deel van de recepten en functionaliteiten. Daarnaast is
                  er een premium abonnement beschikbaar met extra mogelijkheden.
                </p>
              </div>
            </details>

            <details className="mb-8 shadow-md overflow-hidden">
              <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold px-8 py-6">
                Voor wie is SuriHealth bedoeld?
              </summary>

              <div className="px-8 py-6 text-[#4B5563]">
                <p>
                  Voor iedereen die van Surinaams eten houdt maar rekening moet
                  houden met allergieën, diabetes, hart- en vaatziekten of andere
                  dieetbeperkingen.
                </p>
              </div>
            </details>

          </section>

          {/* ACCOUNT */}

          <section id="account">

            <h2 className="text-center text-[2.2rem] font-bold border-b-[5px] border-black pb-3 mb-8">
              Account & Profiel
            </h2>

            <details className="mb-8 shadow-md overflow-hidden">
              <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold px-8 py-6">
                Hoe maak ik een account aan?
              </summary>

              <div className="px-8 py-6 text-[#4B5563]">
                <p>
                  Klik op <strong>Registreer Nu</strong>, vul je e-mailadres in,
                  kies een wachtwoord en beantwoord enkele vragen over je
                  gezondheid en voorkeuren.
                </p>
              </div>
            </details>

            <details className="mb-8 shadow-md overflow-hidden">
              <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold px-8 py-6">
                Kan ik mijn gezondheidsinformatie later aanpassen?
              </summary>

              <div className="px-8 py-6 text-[#4B5563]">
                <p>
                  Ja. Je kunt altijd je profiel aanpassen. De receptsuggesties
                  worden daarna automatisch bijgewerkt.
                </p>
              </div>
            </details>

            <details className="mb-8 shadow-md overflow-hidden">
              <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold px-8 py-6">
                Is mijn gezondheidsinformatie veilig?
              </summary>

              <div className="px-8 py-6 text-[#4B5563]">
                <p>
                  Ja. Je gegevens worden veilig opgeslagen en niet gedeeld zonder
                  jouw toestemming.
                </p>
              </div>
            </details>

          </section>

          {/* RECEPTEN */}

          <section id="recepten">

            <h2 className="text-center text-[2.2rem] font-bold border-b-[5px] border-black pb-3 mb-8">
              Recepten & Functionaliteit
            </h2>

            <details className="mb-8 shadow-md overflow-hidden">
              <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold px-8 py-6">
                Zijn jullie recepten aangepast of gezonder gemaakt?
              </summary>

              <div className="px-8 py-6 text-[#4B5563]">
                <p>
                  Nee. Wij gebruiken authentieke Surinaamse recepten en filteren
                  alleen welke recepten geschikt zijn voor jouw profiel.
                </p>
              </div>
            </details>

            <details className="mb-8 shadow-md overflow-hidden">
              <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold px-8 py-6">
                Hoe werkt de automatische receptenselectie?
              </summary>

              <div className="px-8 py-6 text-[#4B5563]">
                <p>
                  Na het invullen van je profiel bepaalt het systeem welke
                  recepten geschikt zijn. Je kunt zelf kiezen of automatisch een
                  weekmenu laten samenstellen.
                </p>
              </div>
            </details>

            <details className="mb-8 shadow-md overflow-hidden">
              <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold px-8 py-6">
                Kan ik ook handmatig recepten zoeken?
              </summary>

              <div className="px-8 py-6 text-[#4B5563]">
                <p>
                  Ja. Je kunt zoeken op ingrediënt, bereidingstijd, calorieën en
                  type gerecht.
                </p>
              </div>
            </details>
                        <div id="gezondheid" className="scroll-mt-28">
                            <h3 className="text-center text-black border-b-4 border-black text-3xl font-bold mb-6">
                                Gezondheid & Dieet
                            </h3>

                            <details className="mb-8 shadow-md">
                                <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold p-6 flex items-center">
                                    Zijn jullie recepten medisch goedgekeurd?
                                </summary>
                                <div className="p-6 text-[#5C4B3B] bg-white">
                                    SuriHealth is een studentenproject en biedt geen medisch advies. Raadpleeg altijd je arts of diëtist.
                                </div>
                            </details>

                            <details className="mb-8 shadow-md">
                                <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold p-6 flex items-center">
                                    Ik heb meerdere medische condities. Kan SuriHealth daarmee omgaan?
                                </summary>
                                <div className="p-6 text-[#5C4B3B] bg-white">
                                    Ja, je kunt meerdere aandoeningen en allergieën selecteren.
                                </div>
                            </details>

                            <details className="mb-8 shadow-md">
                                <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold p-6 flex items-center">
                                    Wordt rekening gehouden met religieuze dieetwensen?
                                </summary>
                                <div className="p-6 text-[#5C4B3B] bg-white">
                                    Ja. Halal, vegetarisch, veganistisch en andere voorkeuren kunnen worden ingesteld.
                                </div>
                            </details>

                            <details className="mb-8 shadow-md">
                                <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold p-6 flex items-center">
                                    Kunnen jullie helpen bij gewichtsverlies?
                                </summary>
                                <div className="p-6 text-[#5C4B3B] bg-white">
                                    We tonen voedingswaarden en calorieën, maar persoonlijk advies moet via een diëtist verlopen.
                                </div>
                            </details>
                        </div>

                        {/* TECHNISCH */}
                        <div id="technisch" className="scroll-mt-28">
                            <h3 className="text-center text-black border-b-4 border-black text-3xl font-bold mb-6">
                                Technische Vragen
                            </h3>

                            <details className="mb-8 shadow-md">
                                <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold p-6 flex items-center">
                                    Op welke apparaten werkt SuriHealth?
                                </summary>
                                <div className="p-6 text-[#5C4B3B] bg-white">
                                    Desktop, tablet en smartphone worden ondersteund.
                                </div>
                            </details>

                            <details className="mb-8 shadow-md">
                                <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold p-6 flex items-center">
                                    Werkt SuriHealth offline?
                                </summary>
                                <div className="p-6 text-[#5C4B3B] bg-white">
                                    Opgeslagen recepten en boodschappenlijsten zijn offline beschikbaar.
                                </div>
                            </details>

                            <details className="mb-8 shadow-md">
                                <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold p-6 flex items-center">
                                    Hoe vaak wordt de receptendatabase bijgewerkt?
                                </summary>
                                <div className="p-6 text-[#5C4B3B] bg-white">
                                    Maandelijks worden nieuwe recepten toegevoegd en bestaande bijgewerkt.
                                </div>
                            </details>
                        </div>

                        {/* SUPPORT */}
                        <div id="support" className="scroll-mt-28">
                            <h3 className="text-center text-black border-b-4 border-black text-3xl font-bold mb-6">
                                Support & Contact
                            </h3>

                            <details className="mb-8 shadow-md">
                                <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold p-6 flex items-center">
                                    Hoe kan ik contact opnemen?
                                </summary>
                                <div className="p-6 text-[#5C4B3B] bg-white">
                                    Via het contactformulier of support@surihealth.nl.
                                </div>
                            </details>

                            <details className="mb-8 shadow-md">
                                <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold p-6 flex items-center">
                                    Kunnen jullie helpen met medische vragen?
                                </summary>
                                <div className="p-6 text-[#5C4B3B] bg-white">
                                    Voor medische vragen verwijzen wij naar je arts of zorgverlener.
                                </div>
                            </details>

                            <details className="mb-8 shadow-md">
                                <summary className="cursor-pointer bg-[#1A756A] hover:bg-[#2D9C8F] text-white font-bold p-6 flex items-center">
                                    Accepteren jullie feedback?
                                </summary>
                                <div className="p-6 text-[#5C4B3B] bg-white">
                                    Ja, feedback helpt ons om SuriHealth te verbeteren.
                                </div>
                            </details>
                        </div>
                </section>
            </section>

                <section className="py-16 text-center">
                    <Link
                      to="/questions"
                      className="inline-block bg-black text-white px-8 py-4 rounded-lg font-bold hover:bg-[#5C4B3B] transition"
                    >
                      Heeft u nog meer vragen? Neem contact op met ons!
                    </Link>
                </section>
            </main>

            <Footer />
        </>
    )
}
            