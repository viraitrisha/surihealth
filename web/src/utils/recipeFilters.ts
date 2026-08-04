import type { InferSelectModel } from 'drizzle-orm';
import { recipes, profiles } from '../db/schema';

type Recipe = InferSelectModel<typeof recipes>;
type Profile = InferSelectModel<typeof profiles>;

const GLUTEN_ITEMS = /tarwe|tarwebloem|brood|pasta|meel|gluten|flour|bread|noodles|spaghetti|macaroni|roti|bloem/i;
const DAIRY_ITEMS = /melk|kaas|yoghurt|boter|cream|milk|cheese|yogurt|butter|slagroom|zuivel|condensmelk/i;
const PINDA_ITEMS = /pinda|noten|nuts|peanuts|pindakaas|pindasaus/i;
const SHELLFISH_ITEMS = /garnalen|krab|crab|shrimp|prawn|kreeft|lobster|mosselen|schelpdieren|ebbi/i;

const MEAT_ITEMS = /kip|rund|varken|vis|garnalen|krab|chicken|beef|pork|fish|shrimp|prawn|crab|zoutvlees|bakkeljauw|rookvlees|worst|meat|trijp|sardien|lamb|lam|lamsvlees|mutton|bacon|ham|seafood|zeevruchten|duck|eend|doksa|pingo|pakira|hert|deer|wild|kwiekwie|pataka|warapa|kreeft|lobster|mosselen/i;
const VEGAN_ANIMAL_ITEMS = /kip|rund|varken|vis|garnalen|krab|chicken|beef|pork|fish|shrimp|prawn|crab|zoutvlees|bakkeljauw|rookvlees|worst|meat|trijp|sardien|lamb|lam|lamsvlees|mutton|bacon|ham|seafood|zeevruchten|duck|eend|doksa|pingo|pakira|hert|deer|wild|kwiekwie|pataka|warapa|kreeft|lobster|mosselen|melk|kaas|yoghurt|boter|cream|milk|cheese|yogurt|butter|ei|eieren|egg|eggs|honing|honey|slagroom|zuivel|condensmelk/i;

const HIGH_SODIUM_ITEMS = /zoutvlees|bakkeljauw|maggi|bouillon|rookvlees|worst|sardien|bacon|zout|salted/i;
const HIGH_CHOLESTEROL_ITEMS = /varken|pingo|bacon|reuzel|boter|butter|slagroom|cream|worst|paté/i;

export function filterRecipesByProfile(
  recipesList: Recipe[],
  profile: Profile | null
): Recipe[] {
  if (!recipesList) return [];
  if (!profile) return recipesList;

  const allergies = (profile.allergies as string[]) || [];
  const diets = (profile.diets as string[]) || [];
  const dislikes = (profile.dislikes as string[]) || [];
  const conditions = (profile.conditions as string[]) || [];

  const lowerConditions = conditions.map(c => c.toLowerCase().trim());
  const isDiabetic = lowerConditions.includes('diabetic') || lowerConditions.includes('diabeet (suikerziekte)');
  const isHighBloodPressure = lowerConditions.includes('hoge bloeddruk') || lowerConditions.includes('hypertension');
  const isHighCholesterol = lowerConditions.includes('cholesterol') || lowerConditions.includes('hypercholesterolemie');
  const isHeartDisease = lowerConditions.includes('hart- en vaatziekten') || lowerConditions.includes('hart');

  return recipesList.filter(recipe => {
    const categoryId = recipe.category?.toLowerCase() || '';

    if (isDiabetic && (categoryId === 'dessert' || categoryId === 'snack')) {
      return false;
    }

    const enIngs = (recipe.ingredients as string[] || []).map(i => i.toLowerCase().trim());
    const nlIngs = (recipe.ingredientsNl as string[] || []).map(i => i.toLowerCase().trim());
    const allIngredientsCombined = [...enIngs, ...nlIngs];

    if (isHighBloodPressure || diets.includes('Zoutarm')) {
      if (allIngredientsCombined.some(i => HIGH_SODIUM_ITEMS.test(i))) {
        return false;
      }
    }

    if (isHighCholesterol || isHeartDisease) {
      if (allIngredientsCombined.some(i => HIGH_CHOLESTEROL_ITEMS.test(i))) {
        return false;
      }
    }

    if (allergies.some(allergen => {
      const lowerAllergen = allergen.toLowerCase().trim();
      if (lowerAllergen === 'geen') return false;

      if (lowerAllergen.includes('pinda') && allIngredientsCombined.some(i => PINDA_ITEMS.test(i))) {
        return true;
      }
      if (lowerAllergen.includes('schelpdieren') && allIngredientsCombined.some(i => SHELLFISH_ITEMS.test(i))) {
        return true;
      }

      return allIngredientsCombined.some(ing => ing.includes(lowerAllergen));
    })) {
      return false;
    }

    if (dislikes.some(dislike => {
      const lowerDislike = dislike.toLowerCase().trim();
      return allIngredientsCombined.some(ing => ing.includes(lowerDislike));
    })) {
      return false;
    }

    const hasGlutenDiet = diets.includes('Gluten vrij') || diets.includes('Gluten Free');
    if (hasGlutenDiet && allIngredientsCombined.some(i => GLUTEN_ITEMS.test(i))) {
      return false;
    }

    const hasLactoseDiet = diets.includes('Lactose vrij') || diets.includes('Lactose Free');
    if (hasLactoseDiet && allIngredientsCombined.some(i => DAIRY_ITEMS.test(i))) {
      return false;
    }

    const hasVegetarianDiet = diets.includes('Vegetarisch') || diets.includes('Vegetarian');
    if (hasVegetarianDiet && allIngredientsCombined.some(i => MEAT_ITEMS.test(i))) {
      return false;
    }

    const hasVeganDiet = diets.includes('Veganistisch') || diets.includes('Vegan');
    if (hasVeganDiet && allIngredientsCombined.some(i => VEGAN_ANIMAL_ITEMS.test(i))) {
      return false;
    }

    return true;
  });
}
