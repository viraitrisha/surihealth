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

      <div>
        <main className="min-h-screen pt-[50px]">

          {/* Titel */}
          <section className="bg-[#e8f5f3] text-black text-center py-8 px-4 text-2xl font-bold border-b-2 border-[#2D9C8F]">
            <h1 className="m-0 text-[2.8rem]">
              Historie
            </h1>
          </section>


          {/* Zoekbalk */}
          <div className="relative w-[90%] max-w-[60rem] mx-auto my-8">

            <Search
              size={28}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 opacity-70"
            />

            <input
              type="text"
              placeholder="Zoek Recepten"
              className="w-full py-4 pl-20 pr-5 rounded-full border border-gray-300 bg-white text-[1.6rem] focus:outline-none focus:border-[#1A756A] focus:ring-2 focus:ring-[#1A756A]/20"
            />

          </div>


          {/* Recept historie */}
          <section className="my-12">

            <div className="flex justify-between items-center px-8 py-4 mb-6 bg-[#e8f5f3] rounded-full">

            </div>


            <div className="grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-8 p-4">

              {/* Voorbeeld recept kaart */}
              <figure className="overflow-hidden rounded-3xl bg-[#e8f5f3] shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)] transition-transform duration-200 hover:-translate-y-1">

                <a href="/recipes" className="no-underline">

                  <img
                    src="/placeholder.png"
                    alt="Recept"
                    className="w-full h-[20rem] object-cover rounded-3xl transition-transform duration-300 hover:scale-105"
                  />

                  <figcaption className="text-center mt-3 mb-3 font-bold text-[1.6rem] text-black px-4">
                    Gezonde maaltijd
                  </figcaption>

                </a>

              </figure>


            </div>

          </section>

        </main>
      </div>

      <Footer />
    </>
  )
}