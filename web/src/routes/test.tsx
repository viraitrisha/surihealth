import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/test')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/test"!</div>
// }

// import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/test")({
  component: OntbijtPage,
});

type BreakfastRecipe = {
  id: number;
  title: string;
};

const recipes: BreakfastRecipe[] = [
  { id: 1, title: "Havermout met Banaan" },
  { id: 2, title: "Yoghurt met Fruit" },
  { id: 3, title: "Avocado Toast" },
  { id: 4, title: "Smoothie Bowl" },
];

function OntbijtPage() {
  const [search, setSearch] = useState("");

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Ontbijt</h1>

      <input
        type="text"
        placeholder="Zoek recepten"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded p-2 w-full max-w-md mb-8"
      />

      <h2 className="text-2xl font-semibold mb-4">
        Alle Ontbijt Recepten
      </h2>

      <div className="grid gap-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border rounded-lg p-4 shadow"
          >
            <h3>{recipe.title}</h3>
          </div>
        ))}
      </div>
    </main>
  );
}