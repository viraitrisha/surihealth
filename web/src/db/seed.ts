import 'dotenv/config';
import { db } from '../lib/db';
import { recipes } from '../db/schema';
import { translateIngredient } from '../lib/translations';
import axios from 'axios';

const SURINAMESE_INGREDIENTS_EN = new Set([
  'chicken', 'beef', 'pork', 'fish', 'shrimp', 'prawn', 'crab',
  'rice', 'brown rice', 'black-eyed pea', 'kidney bean', 'black bean',
  'potato', 'sweet potato', 'cassava', 'taro', 'plantain', 'banana',
  'tomato', 'onion', 'garlic', 'scallion', 'celery', 'bell pepper',
  'coconut milk', 'coconut cream', 'coconut oil', 'palm oil',
  'okra', 'eggplant', 'pumpkin', 'spinach', 'cabbage', 'green bean',
  'breadfruit', 'corn', 'peanut', 'cashew',
  'salt', 'pepper', 'turmeric', 'curry powder', 'masala', 'cumin',
  'ginger', 'thyme', 'parsley', 'cilantro', 'scotch bonnet', 'habanero',
  'flour', 'bread', 'egg', 'milk', 'butter', 'cheese', 'yogurt',
  'sugar', 'honey', 'vanilla', 'cinnamon', 'nutmeg',
  'noodles', 'pasta', 'vermicelli'
].map(i => i.toLowerCase()));

function isSurinamese(ingredients: string[]): boolean {
  const matched = ingredients.filter(ing =>
    Array.from(SURINAMESE_INGREDIENTS_EN).some(allowed =>
      ing.toLowerCase().includes(allowed)
    )
  ).length;
  return matched / ingredients.length >= 0.6; // 60% herkenbaar Surinaams
}

async function importRecipes() {
  console.log('Start import vanuit TheMealDB');
  // Haal alle categorieën op
  const catRes = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
  const categories: string[] = catRes.data.categories.map((c: any) => c.strCategory);
  console.log(`Gevonden categorieën: ${categories.join(', ')}`);

  let imported = 0, skipped = 0;

  for (const cat of categories) {
    console.log(`\nCategorie: ${cat}`);
    const mealRes = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
    const meals = mealRes.data.meals || [];
    for (const meal of meals) {
      try {
        const detailRes = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
        const full = detailRes.data.meals[0];
        if (!full) continue;

        const ings: string[] = [];
        for (let i = 1; i <= 20; i++) {
          const ing = full[`strIngredient${i}`];
          if (ing && ing.trim()) ings.push(ing.trim());
        }
        if (!isSurinamese(ings)) { skipped++; continue; }

        const ingsNl = ings.map(translateIngredient);

        await db.insert(recipes).values({
          externalId: full.idMeal,
          name: full.strMeal,
          nameNl: full.strMeal,
          category: cat,
          area: full.strArea || 'Onbekend',
          instructions: full.strInstructions,
          imageUrl: full.strMealThumb,
          ingredients: ings,
          ingredientsNl: ingsNl,
        }).onConflictDoUpdate({
          target: recipes.externalId,
          set: {
            name: full.strMeal,
            category: cat,
            area: full.strArea || 'Onbekend',
            instructions: full.strInstructions,
            imageUrl: full.strMealThumb,
            ingredients: ings,
            ingredientsNl: ingsNl,
          },
        });
        imported++;
        if (imported % 10 === 0) console.log(`${imported} recepten geïmporteerd`);
      } catch (err) {
        console.error(`Fout bij ${meal.idMeal}:`, err);
      }
    }
  }
  console.log(`\nKlaar! ${imported} geïmporteerd, ${skipped} overgeslagen.`);
}

importRecipes().catch(console.error).finally(() => process.exit());