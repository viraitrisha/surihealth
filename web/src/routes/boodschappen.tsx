import { createFileRoute } from '@tanstack/react-router'
import { Plus, Trash2, Download } from 'lucide-react'

// import Header from '#/client/components/Layout/PrivateHeader'
import Footer from '#/client/components/Layout/Footer'

export const Route = createFileRoute('/boodschappen')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      {/* <Header /> */}

      <div>
        <main className="min-h-screen pt-[50px]">

          {/* Titel */}
          <section className="bg-[#e8f5f3] text-black text-center py-8 px-4 text-2xl font-bold border-b-2 border-[#2D9C8F]">
            <h1 className="m-0 text-[2.8rem]">Boodschappenlijst</h1>
          </section>

          {/* Shopping list */}
          <section className="max-w-[80rem] mx-auto my-8 p-4 bg-white rounded-[2rem] shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)]">

            <ul className="list-none p-0 m-0">

              {/* Voorbeelditem */}
              <li className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-[#e8f5f3] transition-colors">

                <input
                  type="checkbox"
                  className="w-8 h-8 accent-[#1A756A] cursor-pointer"
                />

                <span className="flex-1 text-[1.6rem]">
                  Tomaten (2)
                </span>

                <button className="text-red-600 hover:scale-110 transition-transform">
                  <Trash2 size={22} />
                </button>

              </li>

            </ul>

          </section>

          {/* Formulier */}
          <section className="flex flex-wrap gap-4 justify-center items-center max-w-[60rem] mx-auto p-4">

            <input
              type="text"
              placeholder="Productnaam"
              className="flex-1 min-w-[18rem] p-4 border border-gray-300 rounded-full text-[1.6rem] focus:outline-none focus:border-[#1A756A]"
            />

            <input
              type="text"
              placeholder="Hoeveelheid (optioneel)"
              className="flex-1 min-w-[18rem] p-4 border border-gray-300 rounded-full text-[1.6rem] focus:outline-none focus:border-[#1A756A]"
            />

            <button className="flex items-center gap-2 bg-[#2D9C8F] text-white py-4 px-8 rounded-full font-bold text-[1.6rem] transition-all duration-200 hover:bg-[#1A756A] hover:-translate-y-1">

              <Plus size={20} />
              Toevoegen

            </button>

          </section>

          {/* Download knop */}
          <div className="flex justify-center mb-12">

            <button className="flex items-center gap-2 bg-[#F4A261] text-white py-4 px-8 rounded-full font-bold text-[1.6rem] transition-all duration-200 hover:bg-[#1A756A] hover:-translate-y-1">

              <Download size={20} />
              Download lijst (TXT)

            </button>

          </div>

        </main>
      </div>

      <Footer />
    </>
  )
}