import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'

import Header from '#/client/components/Layout/PrivateHeader'
import Footer from '#/client/components/Layout/Footer'

export const Route = createFileRoute('/historie')({
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
            Historie
          </h1>
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
            className="w-full py-4 pl-20 pr-4 rounded-full border border-[#ddd] bg-[var(--bg-color)] text-[var(--text-color)] text-lg transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[rgba(26,117,106,0.2)]"
          />
        </div>

        {/* Categorie */}
        <section className="my-12">

          <div className="flex justify-between items-center bg-[var(--welcome-card-color)] rounded-full py-4 px-8 mb-6 mx-[5%]">
            <h2 className="text-[2rem] font-bold text-[var(--primary-color)]">
              Recent bekeken
            </h2>
          </div>

          {/* Recepten */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-8 p-4 mx-[5%]">

            <figure className="overflow-hidden rounded-3xl bg-[var(--welcome-card-color)] shadow-[var(--box-shadow)] transition-transform duration-200 hover:-translate-y-[5px] hover:shadow-[0_1rem_2rem_rgba(0,0,0,0.15)]">

              <img
                src="/placeholder.png"
                alt="Recept"
                className="w-full h-80 object-cover rounded-3xl transition-transform duration-300 hover:scale-105 block"
              />

              <figcaption className="text-center my-3 font-bold text-[1.6rem] text-[var(--text-color)] px-4">
                Gezonde Salade
              </figcaption>

            </figure>

            <figure className="overflow-hidden rounded-3xl bg-[var(--welcome-card-color)] shadow-[var(--box-shadow)] transition-transform duration-200 hover:-translate-y-[5px] hover:shadow-[0_1rem_2rem_rgba(0,0,0,0.15)]">

              <img
                src="/placeholder.png"
                alt="Recept"
                className="w-full h-80 object-cover rounded-3xl transition-transform duration-300 hover:scale-105 block"
              />

              <figcaption className="text-center my-3 font-bold text-[1.6rem] text-[var(--text-color)] px-4">
                Groente Soep
              </figcaption>

            </figure>

            <figure className="overflow-hidden rounded-3xl bg-[var(--welcome-card-color)] shadow-[var(--box-shadow)] transition-transform duration-200 hover:-translate-y-[5px] hover:shadow-[0_1rem_2rem_rgba(0,0,0,0.15)]">

              <img
                src="/placeholder.png"
                alt="Recept"
                className="w-full h-80 object-cover rounded-3xl transition-transform duration-300 hover:scale-105 block"
              />

              <figcaption className="text-center my-3 font-bold text-[1.6rem] text-[var(--text-color)] px-4">
                Fruit Smoothie
              </figcaption>

            </figure>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}