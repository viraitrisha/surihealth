import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo} from 'react'

export const Route = createFileRoute('/recipes/avond-maaltijden')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recipes/avond-maaltijden"!</div>
}


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

function AvondMaaltijden() { 
  const [search, setSearch] = useState("");

  const filteredRecipes = useMemo(() => {
    if (!search.trim()) {
      return recipes;
    }
    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [search]);

  // const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setSearch(e.target.value);
  // };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-green-400 to-green-600 py-12 text-center text-white shadow-lg">
        <h1 className="text-4xl font-bold tracking-tight">
          🍽️ Avond Maaltijd
        </h1>
        <p className="mt-2 text-lg opacity-90">
          Vind de perfecte recepten voor het avondeten
        </p>
      </section>

      <div className="mx-auto max-w-4xl px-4 -mt-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Zoek recepten op naam..."
            value={search}
            // onChange={handleSearchChange}
            className="w-full rounded-full border-2 border-gray-200 bg-white px-6 py-4 pl-12 shadow-lg outline-none transition-all focus:border-green-400 focus:shadow-xl"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <section className="px-4 pb-12 pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800">
              Alle Avond Maaltijd Recepten
            </h2>
            <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
              {filteredRecipes.length} recepten
            </span>
          </div>

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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-md">
              <span className="text-6xl">😕</span>
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

export default AvondMaaltijden; 