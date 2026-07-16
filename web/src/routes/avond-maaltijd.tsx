import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";

export const Route = createFileRoute('/avond-maaltijd')({
  component: RouteComponent,
});

type Recipe = {
  id: number;
  title: string;
  image: string;
};

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Bruine Rijst met Kip",
    image: "https://picsum.photos/400/300?1",
  },
  {
    id: 2,
    title: "Gegrilde Zalm",
    image: "https://picsum.photos/400/300?2",
  },
  {
    id: 3,
    title: "Pasta Bolognese",
    image: "https://picsum.photos/400/300?3",
  },
  {
    id: 4,
    title: "Nasi",
    image: "https://picsum.photos/400/300?4",
  },
  {
    id: 5,
    title: "Bami",
    image: "https://picsum.photos/400/300?5",
  },
  {
    id: 6,
    title: "Groente Curry",
    image: "https://picsum.photos/400/300?6",
  },
];

function RouteComponent() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredRecipes = useMemo(() => {
    if (!search.trim()) {
      return recipes;
    }
    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [search]);

 
  const handleRecipeClick = (recipeId: number) => {
    navigate({
      to: '/recepten-detail',
      search: {
        id: recipeId
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="rounded-xl bg-green-100 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Avond maaltijd
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


      <section className="px-4 pb-12 pt-8">
        <div className="mx-auto max-w-7xl">
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-green-600">
                      {recipe.title}
                    </h3>
                    <button 
                      onClick={() => handleRecipeClick(recipe.id)}
                      className="mt-2 px-5 py-2 bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium rounded-full transition-colors shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
                    >
                      <span>Bekijk recept</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-md">
              <h3 className="mt-4 text-xl font-semibold text-gray-700">
                Geen recepten gevonden
              </h3>
              <p className="mt-2 text-gray-500">
                Probeer een andere zoekterm
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-4 rounded-full bg-green-100 px-6 py-2 font-medium text-green-700 transition-colors hover:bg-green-200"
              >
                Toon alle recepten
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}