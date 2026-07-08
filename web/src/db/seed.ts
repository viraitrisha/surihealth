import axios from 'axios';
import { db } from '../lib/db';
import { recipes } from './schema';
import { eq } from 'drizzle-orm';

const SURINAMESE_INGREDIENTS = new Set([
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

const TRANSLATIONS: Record<string, string> = {
  'chicken': 'kip',
  'beef': 'rundvlees',
  'pork': 'varkensvlees',
  'fish': 'vis',
  'shrimp': 'garnalen',
  'prawn': 'garnalen',
  'crab': 'krab',
  'rice': 'rijst',
  'brown rice': 'zilvervliesrijst',
  'black-eyed pea': 'zwarte-ogen boon',
  'kidney bean': 'kidneyboon',
  'black bean': 'zwarte boon',
  'potato': 'aardappel',
  'sweet potato': 'zoete aardappel',
  'cassava': 'cassave',
  'taro': 'taro',
  'plantain': 'bakbanaan',
  'banana': 'banaan',
  'tomato': 'tomaat',
  'onion': 'ui',
  'garlic': 'knoflook',
  'scallion': 'lente-ui',
  'celery': 'selderij',
  'bell pepper': 'paprika',
  'coconut milk': 'kokosmelk',
  'coconut cream': 'kokosroom',
  'coconut oil': 'kokosolie',
  'palm oil': 'palmolie',
  'okra': 'okra',
  'eggplant': 'aubergine',
  'pumpkin': 'pompoen',
  'spinach': 'spinazie',
  'cabbage': 'kool',
  'green bean': 'sperzieboon',
  'breadfruit': 'broodvrucht',
  'corn': 'maïs',
  'peanut': 'pinda',
  'cashew': 'cashew',
  'salt': 'zout',
  'pepper': 'peper',
  'turmeric': 'kurkuma',
  'curry powder': 'kerriepoeder',
  'masala': 'masala',
  'cumin': 'komijn',
  'ginger': 'gember',
  'thyme': 'tijm',
  'parsley': 'peterselie',
  'cilantro': 'koriander',
  'scotch bonnet': 'Scotch bonnet peper',
  'habanero': 'habanero peper',
  'flour': 'bloem',
  'bread': 'brood',
  'egg': 'ei',
  'milk': 'melk',
  'butter': 'boter',
  'cheese': 'kaas',
  'yogurt': 'yoghurt',
  'sugar': 'suiker',
  'honey': 'honing',
  'vanilla': 'vanille',
  'cinnamon': 'kaneel',
  'nutmeg': 'nootmuskaat',
  'noodles': 'noedels',
  'pasta': 'pasta',
  'vermicelli': 'vermicelli'
};

function translateIngredient(ing: string): string {
  const lower = ing.toLowerCase();
  return TRANSLATIONS[lower] || ing;
}

function isSurinameseRecipe(ingredients: string[]): boolean {
  if (ingredients.length === 0) return false;
  const allowed = ingredients.filter(ing =>
    [...SURINAMESE_INGREDIENTS].some(allowed => ing.toLowerCase().includes(allowed))
  ).length;
  return (allowed / ingredients.length) >= 0.8;
}

export async function importRecipes() {
  console.log('📥 Start import recepten');
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Chicken', 'Seafood'];
  let imported = 0, filteredOut = 0;

  for (const cat of categories) {
    const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
    const meals = res.data.meals ?? [];
    for (const meal of meals) {
      const detail = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
      const full = detail.data.meals?.[0];
      if (!full) continue;

      const ingredients: string[] = [];
      for (let i = 1; i <= 20; i++) {
        const ing = full[`strIngredient${i}`];
        if (ing && ing.trim()) ingredients.push(ing.trim());
      }

      if (!isSurinameseRecipe(ingredients)) {
        filteredOut++;
        continue;
      }

      const ingredientsNl = ingredients.map(translateIngredient);

      await db.insert(recipes).values({
        externalId: full.idMeal,
        name: full.strMeal,
        nameNl: null,
        category: cat,
        area: full.strArea ?? 'Unknown',
        instructions: full.strInstructions,
        instructionsNl: null,
        imageUrl: full.strMealThumb,
        ingredients: ingredients,
        ingredientsNl: ingredientsNl,
      }).onConflictDoUpdate({
        target: recipes.externalId,
        set: {
          name: full.strMeal,
          category: cat,
          area: full.strArea ?? 'Unknown',
          instructions: full.strInstructions,
          imageUrl: full.strMealThumb,
          ingredients: ingredients,
          ingredientsNl: ingredientsNl,
        },
      });

      imported++;
      if (imported % 10 === 0) console.log(`${imported} recepten geïmporteerd`);
    }
  }

  console.log(`Klaar: ${imported} Surinaamse recepten toegevoegd, ${filteredOut} gefilterd.`);
}

if (process.argv.includes('--run')) {
  importRecipes().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}