import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";

type Category = {
  title: string;
  link: string;
  id: string;
};

type Recipe = {
  name: string;
  image: string;
};


const recipes: Record<string, Recipe[]> = {
  top: [
    { name: "Pom", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop" },
    { name: "Bami", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=300&fit=crop" },
    { name: "Nasi", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop" },
    { name: "Roti", image: "https://via.placeholder.com/300x300/FFB6C1/FFFFFF?text=Roti" },
    { name: "Moksi Alesi", image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=300&h=300&fit=crop" },
    { name: "Saoto Soep", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=300&fit=crop" },
  ],
  snacks: [
    { name: "Bara", image: "https://via.placeholder.com/300x300/98FB98/FFFFFF?text=Bara" },
    { name: "Kroket", image: "https://images.unsplash.com/photo-1635278970433-5df9edde9b4b?w=300&h=300&fit=crop" },
    { name: "Pastei", image: "https://via.placeholder.com/300x300/DDA0DD/FFFFFF?text=Pastei" },
    { name: "Loempia", image: "https://images.unsplash.com/photo-1549972574-3e3c1f15b5f3?w=300&h=300&fit=crop" },
    { name: "Kip Saté", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=300&fit=crop" },
    { name: "Telo", image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=300&h=300&fit=crop" },
  ],
  breakfast: [
    { name: "Pannenkoeken", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=300&h=300&fit=crop" },
    { name: "Havermout", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=300&fit=crop" },
    { name: "Eieren", image: "https://images.unsplash.com/photo-1506947411487-a56738267349?w=300&h=300&fit=crop" },
    { name: "Brood", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop" },
    { name: "Fruit", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=300&fit=crop" },
    { name: "Yoghurt", image: "https://images.unsplash.com/photo-1563784464553-4726d9d4d86c?w=300&h=300&fit=crop" },
  ],
  lunch: [
    { name: "Broodje", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop" },
    { name: "Salade", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop" },
    { name: "Soep", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=300&fit=crop" },
    { name: "Wrap", image: "https://images.unsplash.com/photo-1626700054175-7ebb55d5bc97?w=300&h=300&fit=crop" },
    { name: "Sandwich", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop" },
    { name: "Quiche", image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=300&h=300&fit=crop" },
  ],
  dinner: [
    { name: "Bami", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=300&fit=crop" },
    { name: "Nasi", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop" },
    { name: "Pom", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop" },
    { name: "Roti", image: "https://images.unsplash.com/photo-1626776876720-b3ed4c0a008f?w=300&h=300&fit=crop" },
    { name: "Moksi Meti", image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=300&h=300&fit=crop" },
    { name: "Saoto", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=300&fit=crop" },
  ],
  history: [
    { name: "Pom", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop" },
    { name: "Bami", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=300&fit=crop" },
    { name: "Nasi", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop" },
    { name: "Roti", image: "https://images.unsplash.com/photo-1626776876720-b3ed4c0a008f?w=300&h=300&fit=crop" },
    { name: "Saoto", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=300&fit=crop" },
    { name: "Kip Saté", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=300&fit=crop" },
  ],
};

const categories: Category[] = [
  {
    title: "Top Picks",
    link: "",
    id: "top",
  },
  {
    title: "Snacks",
    link: "/snacks",
    id: "snacks",
  },
  {
    title: "Ontbijt",
    link: "/ontbijt",
    id: "breakfast",
  },
  {
    title: "Lunch",
    link: "/lunch",
    id: "lunch",
  },
  {
    title: "Avond Maaltijd",
    link: "/avond-maaltijd",
    id: "dinner",
  },
  {
    title: "Historie",
    link: "/historie",
    id: "history",
  },
];

function RouteComponent() {
  const [search, setSearch] = useState("");


  const filteredRecipes = (categoryId: string) => {
    const categoryRecipes = recipes[categoryId] || [];
    if (!search) return categoryRecipes;
    return categoryRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <main className="px-8 py-8">
      <section className="rounded-xl bg-green-100 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Recepten
        </h1>
      </section>

      
      <div className="relative mx-auto my-8 max-w-3xl">
        <input
          type="text"
          placeholder="Zoek Surinaamse recepten..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border-2 border-green-200 px-6 py-4 shadow-sm focus:border-green-500 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      
      {categories.map((category) => {
        const categoryRecipes = filteredRecipes(category.id);
        if (categoryRecipes.length === 0) return null;

        return (
          <section key={category.id} className="mb-12">
            <div className="mb-4 flex items-center justify-between rounded-full bg-green-100 px-6 py-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {category.title}
              </h2>

              {category.link && (
                <a
                  href={category.link}
                  className="font-medium text-green-700 hover:underline"
                >
                  Meer recepten 
                </a>
              )}
            </div>


            <div className="flex gap-6 overflow-x-auto pb-4">
              {categoryRecipes.map((recipe, index) => (
                <div
                  key={index}
                  className="group min-w-[170px] overflow-hidden rounded-xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 w-full">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition group-hover:opacity-100">
                      <p className="text-sm font-semibold">{recipe.name}</p>
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <p className="font-medium text-gray-800">{recipe.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {search && categories.every(cat => filteredRecipes(cat.id).length === 0) && (
        <div className="py-16 text-center">
          <p className="text-xl text-gray-500">
            Geen Surinaamse recepten gevonden voor "{search}"
          </p>
        </div>
      )}
    </main>
  );
}

export const Route = createFileRoute('/recepten')({
  component: RouteComponent,
})