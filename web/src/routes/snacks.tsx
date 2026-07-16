import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute('/snacks')({
  component: RouteComponent,
});

interface Recipe {
  id: number;
  title: string;
  image: string;
}

function RouteComponent() {
  const [search, setSearch] = useState("");

  const recipes: Recipe[] = [
    {
      id: 1,
      title: "Fruit Smoothie",
      image: "https://picsum.photos/300/200?1",
    },
    {
      id: 2,
      title: "Yoghurt met Granola",
      image: "https://picsum.photos/300/200?2",
    },
    {
      id: 3,
      title: "Energy Balls",
      image: "https://picsum.photos/300/200?3",
    },
  ];

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <main className="px-8 py-8">
      <section className="rounded-xl bg-green-100 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Snacks
        </h1>
      </section>


      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Zoek recepten..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-4 pl-14 text-gray-700 bg-white border-2 border-gray-200 rounded-full focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg"
          />
        </div>
      </div>

     
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b-2 border-gray-200">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Alle Snacks Recepten
          </h2>
          <span className="mt-2 sm:mt-0 text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recept' : 'recepten'}
          </span>
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredRecipes.map((recipe) => (
              <figure
                key={recipe.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-[3/2]">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="text-white font-medium px-6 py-2 border-2 border-white rounded-full text-sm uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300">
                      Bekijk recept
                    </span>
                  </div>
                </div>
                <figcaption className="px-4 py-4 text-center font-medium text-gray-800 text-lg group-hover:text-green-700 transition-colors duration-200">
                  {recipe.title}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-xl text-gray-500">
              Geen recepten gevonden voor "<span className="font-medium text-gray-700">{search}</span>"
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-green-600 hover:text-green-700 font-medium hover:underline transition-all duration-200"
            >
              Toon alle recepten
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

