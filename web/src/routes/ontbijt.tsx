import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";

export const Route = createFileRoute('/ontbijt')({
  component: RouteComponent,
});

interface Recipe {
  id: number;
  title: string;
  image: string;
}

const RECIPES: Recipe[] = [
  {
    id: 1,
    title: "Havermout met banaan",
    image: "https://picsum.photos/300/200?1",
  },
  {
    id: 2,
    title: "Yoghurt met granola",
    image: "https://picsum.photos/300/200?2",
  },
  {
    id: 3,
    title: "Avocado toast",
    image: "https://picsum.photos/300/200?3",
  },
  {
    id: 4,
    title: "Smoothie Bowl",
    image: "https://picsum.photos/300/200?4",
  },
];

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = useMemo(() => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return RECIPES;
    
    return RECIPES.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchLower)
    );
  }, [searchTerm]);

  return (
  <main className="px-8 py-8">
      <section className="rounded-xl bg-green-100 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Ontbijt
        </h1>
      </section>


      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Zoek recepten..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 pl-12 bg-white border border-gray-200 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     shadow-sm hover:shadow-md transition-shadow duration-200"
            aria-label="Zoek recepten"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                       hover:text-gray-600 transition-colors"
              aria-label="Wis zoekopdracht"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <section className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Alle Ontbijt Recepten
          </h2>
          <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? "recept" : "recepten"}
          </span>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Geen recepten gevonden voor "<span className="font-medium">{searchTerm}</span>"
            </p>
            <p className="text-gray-400 mt-1">Probeer een andere zoekopdracht</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <figure
                key={recipe.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md 
                         hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <figcaption className="p-4">
                  <h3 className="font-medium text-gray-800 text-lg">
                    {recipe.title}
                  </h3>
                  <button className="mt-2 text-sm text-green-100 hover:text-green-800 font-medium transition-colors">
                    Bekijk recept 
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}



