import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Utensils, Heart, ArrowRight } from 'lucide-react'

import Header from '#/client/components/Layout/PrivateHeader'
import Footer from '#/client/components/Layout/Footer'

export const Route = createFileRoute('/favorites')({
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
            <h1 className="m-0 text-[2.8rem]">Favorieten</h1>
          </section>

          {/* Zoekbalk */}
          <div className="relative w-[90%] max-w-[60rem] mx-auto my-8">
            <Search
              size={24}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Zoek Recepten"
              className="w-full py-4 pl-16 pr-4 rounded-full border border-gray-300 bg-white text-lg focus:outline-none focus:border-[#2D9C8F] focus:ring-2 focus:ring-[#2D9C8F]/20"
            />
          </div>

          {/* Favorieten */}
          <section className="w-[90%] max-w-[110rem] mx-auto my-12 p-4">

            {/* Voorbeeldkaart */}
            <div className="flex flex-wrap items-center justify-between gap-6 p-6 mb-6 border rounded-3xl bg-white shadow-[0_0.2rem_1rem_rgba(0,0,0,0.15)] transition-transform duration-200 hover:-translate-y-1">

              <img
                src="/placeholder.png"
                alt="Recept"
                className="w-48 h-40 object-cover rounded-xl"
              />

              <div className="flex-1 min-w-[15rem]">
                <h2 className="text-[2rem] font-semibold text-[#1A756A]">
                  Gezonde Salade
                </h2>

                <p className="mt-2 flex items-center gap-2 text-gray-600">
                  <Utensils size={18} />
                  Salades
                </p>
              </div>

              <div className="flex items-center gap-6">

                <button className="text-red-500 transition-transform duration-200 hover:scale-110">
                  <Heart size={34} fill="currentColor" />
                </button>

                <Link
                  to="/recipes"
                  className="flex items-center gap-2 bg-[#2D9C8F] text-white px-6 py-3 rounded-full font-bold transition-all duration-200 hover:bg-[#1A756A] hover:-translate-y-1"
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