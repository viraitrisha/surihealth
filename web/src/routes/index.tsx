// pages/index.tsx (Home)
import { createFileRoute, Link } from '@tanstack/react-router';
import { HeroCarousel } from '../components/hero-carousel';
import { ImageCarousel } from '../components/image-carousel';

export const Route = createFileRoute('/')({ component: Home });

const heroSlides = [
  { image: '/images/HMP Image 1.jpeg', alt: 'Heerlijke Surinaamse gerechten' },
  { image: '/images/HMP Image 2.jpeg', alt: 'Verse lokale ingrediënten' },
  { image: '/images/HMP Image 3.jpeg', alt: 'Gezonde maaltijdplanning' },
];

const galleryImages = [
  { src: '/images/HMP Image 4.jpeg', alt: 'Gerecht 1' },
  { src: '/images/HMP Image 5.jpeg', alt: 'Gerecht 2' },
  { src: '/images/HMP Image 6.jpeg', alt: 'Gerecht 3' },
  { src: '/images/HMP Image 7.jpeg', alt: 'Gerecht 4' },
  { src: '/images/HMP Image 8.jpeg', alt: 'Gerecht 5' },
];

function Home() {
  return (
    <main className="pt-20">
      {/* HERO SLIDESHOW */}
      <HeroCarousel slides={heroSlides} interval={5000} />

      {/* SURIHEALTH TITEL */}
      <section className="w-full py-12 md:py-16 bg-[#0B3F39]">
        <div className="flex items-center justify-center gap-3 md:gap-6 px-4">
          <div className="hidden sm:block flex-1 h-[2px] bg-white/50 rounded-full" />

          <div className="flex items-center gap-2 md:gap-4 text-white font-bold shrink-0">
            <span className="text-3xl sm:text-4xl md:text-5xl leading-none">𓆩༺</span>
            <span className="text-2xl sm:text-4xl md:text-6xl tracking-tight">SURIHEALTH</span>
            <span className="text-3xl sm:text-4xl md:text-5xl leading-none">༻𓆪</span>
          </div>

          <div className="hidden sm:block flex-1 h-[2px] bg-white/50 rounded-full" />
        </div>
      </section>

      {/* DIVERSE GERECHTEN */}
      <section className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white py-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Diverse Gerechten</h2>
        <div className="mx-8 md:mx-16 text-left">
          <h3 className="text-3xl md:text-4xl font-semibold mb-4">
            Voor mensen met medische behoeften
          </h3>
          <p className="text-xl md:text-2xl leading-relaxed">
            Heeft u diabetes, een hoge bloeddruk, cholesterolproblemen of andere
            gezondheidsuitdagingen? Onze maaltijdplanner filtert automatisch alle
            recepten die bij úw situatie passen. U kiest eenvoudig uw aandoening,
            allergieën, dieetvoorkeuren (zoals halal, vegetarisch, glutenvrij) en
            geeft aan wat u lekker vindt. Zo krijgt u elke dag een veilig en
            smakelijk eetplan – zonder zelf uren te moeten uitzoeken wat wel en niet mag.
          </p>
        </div>

        <div className="w-full overflow-hidden relative my-8">
          <ImageCarousel
            images={galleryImages}
            height="h-[200px] md:h-[480px]"
            width="w-[160px] md:w-[400px]"
          />
        </div>

        <div className="mx-8 md:mx-16 text-left md:text-right">
          <h3 className="text-3xl md:text-4xl font-semibold mb-4">
            Voor iedereen die gezonder wil eten
          </h3>
          <p className="text-xl md:text-2xl leading-relaxed">
            Ook zonder specifieke aandoening kunt u SuriHealth gebruiken. Geef simpelweg
            aan dat u “gezonder wilt eten” en wij stellen een uitgebalanceerd weekmenu
            samen vol verse Surinaamse ingrediënten. Ontdek nieuwe gerechten, eet
            gevarieerder en voel u fitter – zónder ingewikkelde regels of restricties.
            Onze planner laat zien dat gezond eten ook lekker én betaalbaar kan zijn.
          </p>
        </div>
      </section>

      {/* WERKING */}
      <section className="grid gap-0">
        {/* Stap 1 */}
        <div className="bg-white text-black min-h-[70vh] p-8 md:p-16">
          <div className="flex items-center gap-4 md:gap-6 mb-4">
            <span className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white text-3xl font-bold flex items-center justify-center rounded-full shadow-[0_0_0.5rem_#0B3F39]">
              1
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A756A] relative">
              Maak een profiel
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] rounded-lg" />
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src="/images/HMP working-section stap 1.png"
              alt="Stap 1"
              className="w-full md:w-[420px] h-auto hover:-translate-y-1 transition-transform"
            />
            <div className="flex-1">
              <p className="text-xl md:text-2xl mb-4">
                U begint uw SuriHealth reis met het invullen van een kort
                gezondheidsprofiel. In slechts 10 vragen vertelt u ons wie u bent,
                hoe oud u bent, en of u bepaalde aandoeningen, allergieën of
                dieetwensen heeft. Dit profiel is de sleutel tot een ervaring die
                volledig om ú draait. Uw antwoorden blijven privé en worden alleen
                gebruikt om de beste maaltijden voor u te selecteren.
              </p>
              <ul className="space-y-3">
                {[
                  'U kunt uw profiel altijd bewerken',
                  'Alle informatie wordt veilig en privé opgeslagen',
                  'Uw profiel vormt de basis voor alle aanbevelingen',
                  'Hoe meer details u geeft, hoe beter de resultaten',
                ].map((item, i) => (
                  <li key={i} className="pl-8 relative text-lg md:text-xl">
                    <span className="text-[#1A756A] font-bold absolute left-0 text-2xl">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Stap 2 */}
        <div className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white min-h-[70vh] p-8 md:p-16">
          <div className="flex items-center gap-4 md:gap-6 mb-4">
            <span className="w-14 h-14 md:w-16 md:h-16 bg-white text-[#1A756A] text-3xl font-bold flex items-center justify-center rounded-full shadow-[0_0_0.5rem_#0B3F39]">
              2
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white relative">
              Filter op basis van profiel
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-white rounded-lg" />
            </h2>
          </div>
          <p className="text-xl md:text-2xl mb-4">
            Zodra uw profiel staat, treedt het intelligente filtersysteem in werking.
            Al onze recepten worden automatisch gecontroleerd op ingrediënten die
            schadelijk kunnen zijn voor úw gezondheid. Recepten met te veel suiker,
            zout of verzadigd vet worden uitgesloten als dat voor u belangrijk is.
            Allergenen zoals pinda's of schelpdieren worden rigoureus geweerd.
            Zo weet u zeker dat elk gerecht dat u ziet, 100% veilig is om te eten.
          </p>
          <ul className="space-y-3">
            {[
              'Medisch veilig voor uw gezondheidssituatie',
              'Culinair aantrekkelijk volgens uw smaak',
              'Praktisch uitvoerbaar met lokale ingrediënten',
              'Budgetvriendelijk',
              'Tijdbesparend',
            ].map((item, i) => (
              <li key={i} className="pl-8 relative text-lg md:text-xl">
                <span className="text-white font-bold absolute left-0 text-2xl">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Stap 3 */}
        <div className="bg-white text-black min-h-[70vh] p-8 md:p-16">
          <div className="flex items-center gap-4 md:gap-6 mb-4">
            <span className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white text-3xl font-bold flex items-center justify-center rounded-full shadow-[0_0_0.5rem_#0B3F39]">
              3
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A756A] relative">
              Automatisch of Handmatig Receptselectie
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] rounded-lg" />
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <p className="flex-1 text-xl md:text-2xl">
              Heeft u haast? Kies dan voor de automatische planner en ontvang met één
              klik een compleet dagmenu dat voldoet aan uw dieetwensen. Liever zelf
              bladeren? In de handmatige modus kunt u onze volledige collectie
              Surinaamse recepten verkennen, filteren op categorie en uw favoriete
              gerechten bewaren. U bepaalt het tempo – wij zorgen dat alles perfect
              aansluit bij uw gezondheid.
            </p>
            <img
              src="/images/HMP working-section stap 3.png"
              alt="Stap 3"
              className="w-full md:w-[750px] h-auto hover:-translate-y-1 transition-transform"
            />
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-white text-4xl md:text-[4rem] font-bold">
          Bent u geïnteresseerd?
          <br />
          <i className="text-3xl md:text-4xl font-normal">Nog geen account?</i>
        </p>
        <p className="text-white/80 text-xl md:text-2xl max-w-2xl mt-4">
          Begin vandaag nog met uw persoonlijke reis naar een gezonder leven. Registreer
          u nu en ontvang direct een op maat gemaakt weekmenu dat perfect aansluit bij uw
          medische profiel en smaakvoorkeuren.
        </p>
        <Link
          to="/register"
          className="mt-6 px-10 md:px-12 py-4 md:py-5 bg-black text-white rounded-lg font-bold text-2xl md:text-3xl hover:bg-[#155B52] hover:shadow-lg hover:-translate-y-1 transition-all"
        >
          REGISTREER NU!
        </Link>
      </section>

      {/* VISIE & MISSIE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 max-w-7xl mx-auto">
        <div>
          <h2 className="pb-4 border-b-4 border-black text-3xl md:text-4xl font-bold text-[#1A756A]">
            Visie
          </h2>
          <p className="text-xl md:text-2xl mt-4 text-gray-700">
            Wij geloven dat gezonde voeding de hoeksteen is van een vitaal en gelukkig
            leven. Ons doel is om elke Surinamer, ongeacht zijn of haar medische
            achtergrond, toegang te geven tot makkelijke, lekkere en veilige maaltijden.
            Met de kracht van technologie en de rijkdom van de Surinaamse keuken bouwen
            we aan een gezondere samenleving, één bord tegelijk.
          </p>
        </div>
        <div>
          <h2 className="pb-4 border-b-4 border-black text-3xl md:text-4xl font-bold text-[#1A756A]">
            Missie
          </h2>
          <p className="text-xl md:text-2xl mt-4 text-gray-700">
            De SuriHealth Mealplanner maakt gezond eten eenvoudig door gepersonaliseerde
            recepten aan te bieden die rekening houden met medische aandoeningen,
            allergieën en persoonlijke voorkeuren. We combineren medische inzichten met
            authentieke smaken, zodat u zonder zorgen kunt genieten van al het lekkers dat
            Suriname te bieden heeft.
          </p>
        </div>
      </section>
    </main>
  );
}