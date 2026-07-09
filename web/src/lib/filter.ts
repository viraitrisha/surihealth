import type { profiles, recipes } from '../db/schema';

type Profile = typeof profiles.$inferSelect;
type Recipe = typeof recipes.$inferSelect;

export function recipePassesFilters(recipe: Recipe, profile: Profile): boolean {
  const ingredients = (recipe.ingredientsNl as string[]) ?? (recipe.ingredients as string[]);

  // Allergieën
  const allergies = (profile.allergies ?? []) as string[];
  for (const allergen of allergies) {
    if (ingredients.some((ing) => ing.toLowerCase().includes(allergen.toLowerCase()))) {
      return false;
    }
  }

  // Dislikes
  const dislikes = (profile.dislikes ?? []) as string[];
  for (const dislike of dislikes) {
    if (ingredients.some((ing) => ing.toLowerCase().includes(dislike.toLowerCase()))) {
      return false;
    }
  }

  // Diëten
  const diets = (profile.diets ?? []) as string[];
  for (const diet of diets) {
    const dl = diet.toLowerCase();
    if (dl === 'vegetarisch' || dl === 'vegetarian') {
      if (ingredients.some((ing) => /kip|rund|varken|vis|garnalen|krab|vlees/i.test(ing))) return false;
    }
    if (dl === 'veganistisch' || dl === 'vegan') {
      if (ingredients.some((ing) => /kip|rund|varken|vis|garnalen|krab|ei|melk|kaas|yoghurt|boter|honing/i.test(ing))) return false;
    }
    if (dl === 'glutenvrij' || dl === 'gluten free') {
      if (ingredients.some((ing) => /tarwe|bloem|brood|pasta|noedels|vermicelli|meel/i.test(ing))) return false;
    }
    if (dl === 'lactosevrij' || dl === 'lactose free') {
      if (ingredients.some((ing) => /melk|kaas|yoghurt|boter|room/i.test(ing))) return false;
    }
  }

  // Medische Condities
  const conditions = (profile.conditions ?? []) as string[];
  if (conditions.some((c) => c.toLowerCase() === 'diabetes' || c.toLowerCase() === 'diabetic')) {
    if (recipe.category.toLowerCase() === 'dessert') return false;
  }

  return true;
}