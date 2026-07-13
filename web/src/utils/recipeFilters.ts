import type { InferSelectModel } from 'drizzle-orm';
import { recipes, profiles } from '../db/schema';

type Recipe = InferSelectModel<typeof recipes>;
type Profile = InferSelectModel<typeof profiles>;

const GLUTEN_ITEMS = /tarwe|brood|pasta|meel|gluten|flour|bread|noodles/i;
const DAIRY_ITEMS = /melk|kaas|yoghurt|boter|cream|milk|cheese|yogurt|butter/i;
const MEAT_ITEMS = /kip|rund|varken|vis|garnalen|chicken|beef|pork|fish|shrimp|prawn|crab/i;

function arrayContainsAny(ingredients: string[], regex: RegExp): boolean {
  return ingredients.some(i => regex.test(i));
}

export function filterRecipesByProfile(
  recipes: Recipe[],
  profile: Profile | null
): Recipe[] {
  if (!profile) return recipes;

  const allergies = (profile.allergies as string[]) || [];
  const diets = (profile.diets as string[]) || [];
  const dislikes = (profile.dislikes as string[]) || [];
  const conditions = (profile.conditions as string[]) || [];

  return recipes.filter(recipe => {
    const ingredients = recipe.ingredients as string[];

    // 1. Allergies
    const hasAllergy = allergies.some(allergen =>
      ingredients.some(ing => ing.toLowerCase().includes(allergen.toLowerCase()))
    );
    if (hasAllergy) return false;

    // 2. Dislikes
    const hasDislike = dislikes.some(dislike =>
      ingredients.some(ing => ing.toLowerCase().includes(dislike.toLowerCase()))
    );
    if (hasDislike) return false;

    // 3. Medical conditions
    if (conditions.includes('Diabetic') && recipe.category === 'Dessert') {
      return false;
    }

    // 4. Diets
    if (diets.includes('Gluten Free') && arrayContainsAny(ingredients, GLUTEN_ITEMS)) {
      return false;
    }
    if (diets.includes('Lactose Free') && arrayContainsAny(ingredients, DAIRY_ITEMS)) {
      return false;
    }
    if (diets.includes('Vegetarian') && arrayContainsAny(ingredients, MEAT_ITEMS)) {
      return false;
    }

    return true;
  });
}