import 'dotenv/config';
import { db } from './index';
import { recipes } from './schema';
import { SURINAMESE_INGREDIENTS } from '../utils/surinameIngredients';
import { translateIngredient } from '../utils/translations';
import crypto from 'crypto';

const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

async function fetchMealsByCategory(cat: string) {
  const res = await fetch(`${MEALDB_BASE}/filter.php?c=${cat.toLowerCase()}`);
  
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || !contentType.includes("application/json")) {
    console.warn(`Warning: Skipping category "${cat}". API returned an invalid response or HTML.`);
    return [];
  }

  const data = await res.json();
  return (data.meals || []) as { idMeal: string; strMeal: string; strMealThumb: string }[];
}

async function fetchMealById(id: string) {
  const res = await fetch(`${MEALDB_BASE}/lookup.php?i=${id}`);
  
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || !contentType.includes("application/json")) return null;

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

function determineMealTypes(apiCategory: string, ingredients: string[], name: string): string[] {
  const categories = new Set<string>();
  const lowerName = name.toLowerCase();
  const lowerIngredients = ingredients.map(i => i.toLowerCase());

  // 1. Ontbijt
  const breakfastTriggers = ['egg', 'milk', 'butter', 'bread', 'pancake', 'toast', 'oats', 'porridge', 'banana', 'honey', 'yogurt', 'fruit'];
  if (apiCategory.toLowerCase() === 'breakfast' || breakfastTriggers.some(t => lowerName.includes(t))) {
    categories.add('ontbijt');
  }

  // 2. Dessert
  if (apiCategory.toLowerCase() === 'dessert' || lowerName.includes('cake') || lowerName.includes('pudding')) {
    categories.add('dessert');
    return Array.from(categories);
  }

  // 3. Lunch (Light components)
  const lightLunchTriggers = ['soup', 'sandwich', 'salad', 'bread', 'wrap'];
  if (['starter', 'side'].includes(apiCategory.toLowerCase()) || lightLunchTriggers.some(t => lowerName.includes(t))) {
    categories.add('lunch');
  }

  // 4. Warm Meals (Middagmaaltijd / Avondeten staples)
  const heavyProteins = ['chicken', 'beef', 'pork', 'lamb', 'fish', 'shrimp', 'bakkeljauw', 'zoutvlees'];
  const heavyCarbs = ['rice', 'pasta', 'noodles', 'spaghetti', 'macaroni', 'cassava', 'potato', 'sweet potato', 'plantain', 'masala'];
  const hasProtein = lowerIngredients.some(ing => heavyProteins.some(p => ing.includes(p)));
  const hasCarb = lowerIngredients.some(ing => heavyCarbs.some(c => ing.includes(c)));

  if (['beef', 'chicken', 'lamb', 'pork', 'seafood', 'pasta'].includes(apiCategory.toLowerCase()) || (hasProtein && hasCarb)) {
    categories.add('middagmaaltijd');
    categories.add('avondeten');
    if (!categories.has('lunch')) categories.add('lunch');
  }

  if (categories.size === 0) {
    categories.add('lunch');
    categories.add('avondeten');
  }

  return Array.from(categories);
}

async function seed() {
  console.log('Start seeding recipes...');
  
  const categories = ['Beef', 'Chicken', 'Dessert', 'Lamb', 'Pasta', 'Pork', 'Seafood', 'Side', 'Starter', 'Vegetarian', 'Breakfast'];
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

      const ingredientsNl = ingredients.map(translateIngredient) as string[];
      const uniqueRecipeId = crypto.randomUUID();
      
      const dynamicMealTypes = determineMealTypes(cat, ingredients, full.strMeal);
      
      const topPickKeywords = ['curry', 'stew', 'rice', 'chicken', 'fish', 'banana', 'coconut', 'spaghetti', 'fried'];
      const isTopPick = topPickKeywords.some(keyword => full.strMeal.toLowerCase().includes(keyword)) && Math.random() > 0.4;

      await db
        .insert(recipes)
        .values({
          id: uniqueRecipeId, 
          externalId: full.idMeal,
          name: full.strMeal,
          nameNl: null,
          category: cat,
          mealTypes: dynamicMealTypes,
          isTopPick: isTopPick,        
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
            mealTypes: dynamicMealTypes,
            isTopPick: isTopPick,
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