import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Utensils, Heart, ArrowRight } from 'lucide-react'

import Header from '#/client/components/Layout/PrivateHeader'
import Footer from '#/client/components/Layout/Footer'

export const Route = createFileRoute('/_favorites/favorites')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />

      <div>
        <main className="min-h-screen pt-[50px]">

          {/* Titel */}
          <section className="bg-[var(--welcome-card-color)] text-[var(--text-color)] text-center py-8 px-4 text-2xl font-bold border-b-2 border-[var(--secondary-color)]">
            <h1 className="m-0 text-[2.8rem]">Favorieten</h1>
          </section>

          {/* Zoekbalk */}
          <div className="relative w-[90%] max-w-[60rem] mx-auto my-8">
            <Search
              size={24}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-color)] opacity-60"
            />

            <input
              type="text"
              placeholder="Zoek Recepten"
              className="w-full py-4 pl-16 pr-4 rounded-full border border-[#ddd] bg-[var(--bg-color)] text-[var(--text-color)] text-lg transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[rgba(26,117,106,0.2)]"
            />
          </div>

          {/* Favorieten */}
          <section className="w-[90%] max-w-[110rem] mx-auto my-12 p-4">

            {/* Voorbeeldkaart */}
            <div className="flex flex-wrap items-center justify-between gap-6 p-6 mb-6 border border-black/10 rounded-3xl bg-[var(--bg-color)] shadow-[var(--box-shadow)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_1rem_2rem_rgba(0,0,0,0.1)]">

              <img
                src="/placeholder.png"
                alt="Recept"
                className="w-48 h-40 object-cover rounded-2xl"
              />

              <div className="flex-1 min-w-[15rem]">
                <h2 className="text-[2rem] font-semibold text-[var(--primary-color)]">
                  Gezonde Salade
                </h2>

                <p className="mt-2 flex items-center gap-2 text-[var(--text-color)] opacity-70 text-[1.4rem]">
                  <Utensils
                    size={18}
                    className="text-[var(--secondary-color)]"
                  />
                  Salades
                </p>
              </div>

              <div className="flex items-center gap-6 flex-wrap">

               <button className="bg-transparent border-none text-[var(--error)] transition-all duration-200 hover:scale-110 cursor-pointer">
                <Heart size={34} fill="currentColor" />
                </button>

                <Link
                  to="/recipes"
                  className="flex items-center gap-2 bg-[var(--secondary-color)] text-[var(--white-color)] px-6 py-3 rounded-full font-bold transition-all duration-200 hover:bg-[var(--primary-color)] hover:-translate-y-[2px] hover:shadow-[var(--box-shadow)]"
                >
                  Recept
                  <ArrowRight size={18} />
                </Link>

              </div>
            </div>

          </section>

        </main>
      </div>

      <Footer />
    </>
  )
}