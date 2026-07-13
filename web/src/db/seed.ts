import 'dotenv/config';
import { db } from './index';
import { recipes } from './schema';
import { SURINAMESE_INGREDIENTS } from '../utils/surinameIngredients';
import { translateIngredient } from '../utils/translation';

const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

async function fetchMealsByCategory(cat: string) {
  const res = await fetch(`${MEALDB_BASE}/filter.php?c=${cat}`);
  const data = await res.json();
  return (data.meals || []) as { idMeal: string; strMeal: string; strMealThumb: string }[];
}

async function fetchMealById(id: string) {
  const res = await fetch(`${MEALDB_BASE}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals?.[0] || null;
}

function extractIngredients(meal: any): string[] {
  const ings: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    if (ing && ing.trim()) ings.push(ing.trim());
  }
  return ings;
}

function isSurinameseRecipe(ingredients: string[]): boolean {
  if (ingredients.length === 0) return false;
  const allowedCount = ingredients.filter(ing =>
    [...SURINAMESE_INGREDIENTS].some(allowed => ing.toLowerCase().includes(allowed))
  ).length;
  return (allowedCount / ingredients.length) >= 0.6;
}

async function seed() {
  console.log('Start seeding recipes...');
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Chicken', 'Seafood'];
  let imported = 0;
  let skipped = 0;

  for (const cat of categories) {
    console.log(`Category: ${cat}`);
    const meals = await fetchMealsByCategory(cat);
    console.log(`   → ${meals.length} meals found`);

    for (const meal of meals) {
      const full = await fetchMealById(meal.idMeal);
      if (!full) continue;

      const ingredients = extractIngredients(full);
      if (!isSurinameseRecipe(ingredients)) {
        skipped++;
        continue;
      }

      const ingredientsNl = ingredients.map(translateIngredient);

      await db
        .insert(recipes)
        .values({
          externalId: full.idMeal,
          name: full.strMeal,
          nameNl: null,
          category: cat,
          area: full.strArea || 'Unknown',
          instructions: full.strInstructions,
          instructionsNl: null,
          imageUrl: full.strMealThumb,
          calories: null,
          ingredients: ingredients,
          ingredientsNl: ingredientsNl,
        })
        .onConflictDoUpdate({
          target: recipes.externalId,
          set: {
            name: full.strMeal,
            category: cat,
            area: full.strArea || 'Unknown',
            instructions: full.strInstructions,
            imageUrl: full.strMealThumb,
            ingredients: ingredients,
            ingredientsNl: ingredientsNl,
          },
        });

      imported++;
      if (imported % 10 === 0) console.log(`   → ${imported} imported so far`);
    }
  }

  console.log(`Done: ${imported} imported, ${skipped} skipped (non-Surinamese).`);
  process.exit(0);
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});