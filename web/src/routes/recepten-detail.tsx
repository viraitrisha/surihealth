import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/recepten-detail")({
  component: ReceptenPage,
});

function ReceptenPage() {
  const [favorite, setFavorite] = useState(false);

  const ingredients = [
    "2 eieren",
    "200 ml melk",
    "100 g havermout",
    "1 banaan",
    "1 tl kaneel",
  ];

  const similarRecipes = [
    {
      id: 1,
      title: "Healthy Pancakes",
      image: "https://images.unsplash.com/photo-1575853121743-60c24f0a7502?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Fruit Bowl",
      image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Omelet",
      image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&h=300&fit=crop",
    },
  ];

  return (
    <main className="px-8 py-8">
      <section className="mb-8 rounded-xl bg-green-100 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Recepten Detail
        </h1>
      </section>

      <Link
        to="/recepten"
        className="mb-8 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
      >
        ← Terug naar recepten
      </Link>


      <section className="flex flex-wrap gap-8 rounded-2xl bg-white p-8 shadow">

        <div className="flex-1 min-w-[300px]">
          <img
            src="https://images.unsplash.com/photo-1586448171914-e2f1bb0ca72a?w=600&h=400&fit=crop"
            alt="Havermout ontbijt met banaan en kaneel"
            className="w-full rounded-xl object-cover h-[300px]"
          />
        </div>

        <div className="flex flex-[2] flex-col gap-5">

          <h1 className="text-4xl font-bold">
            Havermout Ontbijt
          </h1>

          <div className="flex gap-2">
            <span className="rounded-full bg-gray-100 px-4 py-2">
              Gezond
            </span>

            <span className="rounded-full bg-gray-100 px-4 py-2">
              Ontbijt
            </span>

            <span className="rounded-full bg-gray-100 px-4 py-2">
              Vegetarisch
            </span>
          </div>

        </div>

      </section>

      <section className="rounded-2xl bg-white p-8 shadow">

        <h2 className="mb-4 border-l-4 border-green-600 pl-4 text-2xl font-bold">
          Details
        </h2>

        <p>
          Meng alle ingrediënten samen en bak ongeveer vijf minuten.
          Serveer met vers fruit en honing.
        </p>

      </section>


      <section className="rounded-2xl bg-white p-8 shadow">

        <h2 className="mb-4 border-l-4 border-green-600 pl-4 text-2xl font-bold">
          Ingrediënten
        </h2>

        <ul className="space-y-2">

          {ingredients.map((ingredient) => (
            <li key={ingredient}>
              • {ingredient}
            </li>
          ))}

        </ul>

        <button className="mt-6 rounded-full bg-green-600 px-6 py-3 text-white hover:bg-green-700">
          Alle ingrediënten toevoegen
        </button>

      </section>


<button
  onClick={() => setFavorite(!favorite)}
  className="fixed bottom-15 right-8 group"
>
  <svg 
    viewBox="0 0 24 24" 
    className={`w-8 h-8 transition-all ${
      favorite 
        ? "fill-red-500 stroke-red-500" 
        : "fill-none stroke-gray-400 hover:stroke-red-400"
    }`}
    strokeWidth="2"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
</button>

      <section>

        <h2 className="mb-6 border-l-4 border-green-600 pl-4 text-2xl font-bold">
          Soortgelijke recepten
        </h2>

        <div className="flex gap-6 overflow-x-auto">

          {similarRecipes.map((recipe) => (

            <div
              key={recipe.id}
              className="min-w-[180px] rounded-xl bg-white p-4 shadow"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="h-40 w-full rounded-lg object-cover"
              />

              <p className="mt-3 text-center font-medium">
                {recipe.title}
              </p>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}

