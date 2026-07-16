import { Link } from "@tanstack/react-router";
import { useLanguage } from "#/contexts/language-context";
import { getTranslations } from "../translations/translations";

export default function WelcomeCard() {
    const { language} = useLanguage();
  const t = getTranslations(language);
    return ( 

        <section className="bg-[var(--welcome-card-color)] w-[90%] max-w-[80rem] mx-auto mt-50 mb-16 p-12 text-center
        rounded-2xl shadow-custom transition-transform duration-200 hover:-translate-y-1">
            <h2 className="mt-0 mb-4 text-[var(--text-color)] text-2xl font-bold"> {t.welcome}, gebruiker</h2>
            <p className="mb-8 text-[1.8rem]">{t.recipeQuestion}</p>

            <div>
              <Link to= "/automatisch" className="inline-block no-underline bg-[var(--secondary-color)] text-[var(--white-color)] mt-4 mr-4 border-none
              py-4 px-8 rounded-[4rem] cursor-pointer text-[1.6rem] font-bold transition-all duration-200 hover:bg-[var(--primary-color)]
              hover:-translate-y-1 hover:shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)]">
              {t.automatic}
              </Link>

              <Link to= "/handmatig" className="inline-block no-underline bg-[var(--secondary-color)] text-[var(--white-color)] mt-4 mr-4 border-none
              py-4 px-8 rounded-[4rem] cursor-pointer text-[1.6rem] font-bold transition-all duration-200 hover:bg-[var(--primary-color)]
              hover:-translate-y-1 hover:shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)]">
              {t.manual}
              </Link>
            </div>
        </section>
    )
}