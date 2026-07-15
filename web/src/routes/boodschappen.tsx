import { createFileRoute } from '@tanstack/react-router'
import { Plus, Trash2, Download } from 'lucide-react'

import Header from '#/client/components/Layout/PrivateHeader'
import Footer from '#/client/components/Layout/Footer'

export const Route = createFileRoute('/boodschappen')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />

      <main className="min-h-screen pt-[50px]">

        {/* Titel */}
        <section className="bg-[var(--welcome-card-color)] text-[var(--text-color)] text-center py-8 px-4 border-b-2 border-[var(--secondary-color)]">
          <h1 className="m-0 text-[2.8rem] font-bold">
            Boodschappenlijst
          </h1>
        </section>

        {/* Shopping list */}
        <section className="max-w-[80rem] mx-auto my-8 p-4 bg-[var(--bg-color)] rounded-[2rem] shadow-[var(--box-shadow)]">

          <ul className="list-none p-0 m-0">

            {/* Voorbeelditem */}
            <li className="flex items-center gap-4 p-4 border-b border-black/10 transition-colors duration-200 hover:bg-[var(--welcome-card-color)]">

              <input
                type="checkbox"
                className="w-8 h-8 cursor-pointer accent-[var(--primary-color)]"
              />

              <span className="flex-1 text-[1.6rem] text-[var(--text-color)]">
                Tomaten (2)
              </span>

              <button className="bg-transparent border-none text-[var(--error)] cursor-pointer p-2 transition-transform duration-100 hover:scale-110 hover:text-[#b71c1c]">
                <Trash2 size={22} />
              </button>

            </li>

          </ul>

        </section>

        {/* Formulier */}
        <section className="flex flex-wrap gap-4 justify-center items-center max-w-[60rem] mx-auto my-8 p-4">

          <input
            type="text"
            placeholder="Productnaam"
            className="flex-1 min-w-[18rem] p-4 border border-[#ccc] rounded-full text-[1.6rem] bg-[var(--bg-color)] text-[var(--text-color)] transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[rgba(26,117,106,0.2)]"
          />

          <input
            type="text"
            placeholder="Hoeveelheid (optioneel)"
            className="flex-1 min-w-[18rem] p-4 border border-[#ccc] rounded-full text-[1.6rem] bg-[var(--bg-color)] text-[var(--text-color)] transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[rgba(26,117,106,0.2)]"
          />

          <button className="flex items-center gap-2 bg-[var(--secondary-color)] text-[var(--white-color)] py-4 px-8 rounded-full font-bold text-[1.6rem] transition-all duration-200 hover:bg-[var(--primary-color)] hover:-translate-y-[2px] hover:shadow-[var(--box-shadow)]">
            <Plus size={20} />
            Toevoegen
          </button>

        </section>

        {/* Download knop */}
        <div className="flex justify-center mb-12">

          <button className="flex items-center gap-2 bg-[var(--accent-color)] text-[var(--white-color)] py-4 px-8 rounded-full font-bold text-[1.6rem] transition-all duration-200 hover:bg-[var(--primary-color)] hover:-translate-y-[2px] hover:shadow-[var(--box-shadow)]">
            <Download size={20} />
            Download lijst (TXT)
          </button>

        </div>

      </main>

      <Footer />
    </>
  )
}