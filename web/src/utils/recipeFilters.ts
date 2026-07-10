import type { Recipe, Profile } from '../db/schema';

function recipeContainsIngredient(recipe: Recipe, search: string): boolean {
  const lowerSearch = search.toLowerCase();
  return recipe.ingredients.some(ing =>
    ing.toLowerCase().includes(lowerSearch)
  );
}

const MEAT_INGREDIENTS = [
  'chicken', 'beef', 'pork', 'lamb', 'fish', 'shrimp', 'prawn', 'crab',
  'sausage', 'bacon', 'ham', 'turkey', 'duck', 'venison', 'anchovy',
  'salmon', 'tuna', 'cod', 'mackerel', 'sardine', 'meat'
];

const GLUTEN_INGREDIENTS = [
  'flour', 'bread', 'pasta', 'noodles', 'vermicelli', 'spaghetti',
  'macaroni', 'lasagne', 'couscous', 'bulgur', 'semolina', 'barley',
  'rye', 'oats', 'wheat', 'gluten'
];

const DAIRY_INGREDIENTS = [
  'milk', 'cheese', 'butter', 'yogurt', 'cream', 'sour cream',
  'cream cheese', 'mozzarella', 'parmesan', 'cheddar', 'ricotta',
  'feta', 'brie', 'gouda', 'swiss cheese', 'blue cheese', 'condensed milk'
];

const HIGH_SUGAR_INGREDIENTS = [
  'sugar', 'honey', 'maple syrup', 'molasses', 'brown sugar',
  'powdered sugar', 'jam', 'jelly', 'chocolate', 'caramel'
];

export function applyFilters(recipes: Recipe[], profile: Profile | null): Recipe[] {
  if (!profile) return recipes; // Geen profiel -> alle recepten tonen

  // 1. Allergieën
  let filtered = recipes.filter(recipe => {
    for (const allergy of profile.allergies) {
      if (recipeContainsIngredient(recipe, allergy)) {
        return false;
      }
    }
    return true;
  });

  // 2. Dislikes (vermijden)
  filtered = filtered.filter(recipe => {
    for (const dislike of profile.dislikes) {
      if (recipeContainsIngredient(recipe, dislike)) {
        return false;
      }
    }
    return true;
  });

  // 3. Dieet
  const diets = new Set(profile.diets.map(d => d.toLowerCase()));

  if (diets.has('vegetarian')) {
    filtered = filtered.filter(recipe =>
      !recipe.ingredients.some(ing =>
        MEAT_INGREDIENTS.some(meat => ing.toLowerCase().includes(meat))
      )
    );
  }

  if (diets.has('gluten free')) {
    filtered = filtered.filter(recipe =>
      !recipe.ingredients.some(ing =>
        GLUTEN_INGREDIENTS.some(gluten => ing.toLowerCase().includes(gluten))
      )
    );
  }

  if (diets.has('lactose free')) {
    filtered = filtered.filter(recipe =>
      !recipe.ingredients.some(ing =>
        DAIRY_INGREDIENTS.some(dairy => ing.toLowerCase().includes(dairy))
      )
    );
  }

  // 4. Medische Condities
  const conditions = new Set(profile.conditions.map(c => c.toLowerCase()));

  if (conditions.has('diabetic')) {
    // Geen desserts en geen suikerrijke ingrediënten
    filtered = filtered.filter(recipe => {
      if (recipe.category.toLowerCase() === 'dessert') return false;
      return !recipe.ingredients.some(ing =>
        HIGH_SUGAR_INGREDIENTS.some(sugar => ing.toLowerCase().includes(sugar))
      );
    });
  }

  // 5. Likes (at top)
  if (profile.likes.length > 0) {
    filtered = filtered.sort((a, b) => {
      const aLiked = profile.likes.some(like => recipeContainsIngredient(a, like)) ? 1 : 0;
      const bLiked = profile.likes.some(like => recipeContainsIngredient(b, like)) ? 1 : 0;
      return bLiked - aLiked;
    });
  }

  return filtered;
}