import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute('/recipes/lunch')({
  component: LunchPage,
});

function LunchPage() {
  return <div>Lunch</div>;
}

type Recipe = {
  id: number;
  title: string;
  image: string;
};

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Kipsalade",
    image: "https://picsum.photos/300/200?1",
  },
  {
    id: 2,
    title: "Wrap met Kip",
    image: "https://picsum.photos/300/200?2",
  },
  {
    id: 3,
    title: "Pasta Salade",
    image: "https://picsum.photos/300/200?3",
  },
  {
    id: 4,
    title: "Tosti",
    image: "https://picsum.photos/300/200?4",
  },
  {
    id: 5,
    title: "Broodje Tonijn",
    image: "https://picsum.photos/300/200?5",
  },
  {
    id: 6,
    title: "Caesar Salade",
    image: "https://picsum.photos/300/200?6",
  },
];

export default function Lunch() {
  const [search, setSearch] = useState("");

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <main className="px-8 py-8">
      <section className="rounded-xl bg-green-100 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Lunch
        </h1>
      </section>


     
      <div className="mx-auto my-8 max-w-3xl px-4">
        <input
          type="text"
          placeholder="Zoek recepten"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border px-6 py-4 shadow-sm outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      
      <section className="px-8 pb-12">
        <div className="mb-6 rounded-full bg-green-100 px-6 py-4">
          <h2 className="text-2xl font-semibold">
            Alle Lunch Recepten ({filteredRecipes.length})
          </h2>
        </div>

       
        {filteredRecipes.length === 0 ? (
          <p className="text-center text-gray-500 text-xl py-12">
            Geen recepten gevonden voor "{search}"
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecipes.map((recipe) => (
              <figure
                key={recipe.id}
                className="overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="h-56 w-full object-cover"
                  loading="lazy" 
                />
                <figcaption className="p-4 text-center font-semibold">
                  {recipe.title}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}