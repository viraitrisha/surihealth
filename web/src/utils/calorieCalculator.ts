interface CalorieRule {
  regex: RegExp;
  calories: number;
}

const CALORIE_RULES_MATRIX: CalorieRule[] = [
  // 1. Gevogelte & Wild
  { regex: /kip|chicken|hen|haan|breast|filet|vleugels|wings|bout|drumstick|thigh|eend|duck|doksa|kalkoen|turkey/i, calories: 140 },
  
  // 2. Rund, Lam & Zwaar Vlees
  { regex: /rund|beef|steak|gehakt|mince|biefstuk|rib|ribs|lam|lamb|mutton|lamsvlees|hert|deer|wild|steak|zoutvlees/i, calories: 190 },
  
  // 3. Varkensvlees & Vleeswaren
  { regex: /varken|pork|bacon|ham|worst|sausage|pingo|pakira|spek|gammon|salami|chorizo|rookvlees|trijp/i, calories: 220 },
  
  // 4. Vis & Conserven
  { regex: /vis|fish|bakkeljauw|cod|sardien|sardine|zalm|salmon|tuna|tonijn|makreel|mackerel|forel|trout|snapper|pataka|warapa|kwiekwie/i, calories: 95 },
  
  // 5. Schaaldieren & Schelpdieren
  { regex: /garnaal|prawn|shrimp|ebbi|krab|crab|kreeft|lobster|mossel|mussel|oester|oyster|inktvis|squid|octopus|seafood|zeevruchten/i, calories: 70 },
  
  // 6. Koolhydraten, Granen & Meel
  { regex: /rijst|rice|roti|bloem|flour|meel|pasta|spaghetti|macaroni|noodles|noedels|brood|bread|wrap|tortilla|couscous|quinoa|bulgur|haver|oats/i, calories: 120 },
  
  // 7. Surinaamse Aardvruchten & Knollen
  { regex: /cassave|cassava|tayer|napi|pompoen|pumpkin|banaan|banana|plantaan|plantain|aardappel|potato|sweet potato|zoete aardappel|yam/i, calories: 90 },
  
  // 8. Vetten, Oliën & Heavy Dairy
  { regex: /boter|butter|olie|oil|ghee|reuzel|lard|margarine|kaas|cheese|cheddar|parmesan|mozzarella|room|cream|slagroom|kokosmelk|coconut milk/i, calories: 150 },
  
  // 9. Melk, Eieren & Teff
  { regex: /melk|milk|yoghurt|yogurt|ei|eieren|egg|eggs|sojamelk|soyamilk|amandelmelk|almond milk|kwark|paneer|tofu|tauhu|tempeh/i, calories: 50 },
  
  // 10. Peulvruchten, Noten & Zaden
  { regex: /pinda|peanut|noten|nuts|walnut|almond|cashew|pindakaas|pindasaus|bonen|beans|linzen|lentils|erwten|peas|kikkererwten|chickpeas|dahl/i, calories: 85 },
  
  // 11. Suikers & Smaakmakers
  { regex: /suiker|sugar|honing|honey|siroop|syrup|stroop|ketjap|ketchup|mayonaise|mayo|mosterd|mustard|jam|marmelade|chocolade|cocoa/i, calories: 35 },
  
  // 12. Groenten, Kruiden & Aromaten (Zachte calorieën)
  { regex: /kouseband|sopropo|antruwa|amsoi|tajerblad|spinazie|spinach|tomaat|tomato|ui|onion|knoflook|garlic|peper|pepper|chili|gember|ginger|laos|sereh|citroengras|selderij|celery|peterselie|parsley|koriander|cilantro|komkommer|cucumber|sla|lettuce|kool|cabbage|wortel|carrot|paprika/i, calories: 12 }
];

export function estimateRecipeCalories(ingredients: string[] | null | undefined): number {
  let totalCalories = 120; 
  
  if (!ingredients || !Array.isArray(ingredients)) {
    return totalCalories;
  }

  const uniqueIngredientsTokenSet = new Set<string>();
  
  ingredients.forEach(i => {
    const rawString = String(i).toLowerCase().trim();
    if (rawString) {
      uniqueIngredientsTokenSet.add(rawString);
    }
  });

  uniqueIngredientsTokenSet.forEach((cleanIng) => {
    for (const rule of CALORIE_RULES_MATRIX) {
      if (rule.regex.test(cleanIng)) {
        totalCalories += rule.calories;
        break;
      }
    }
  });

  return Math.max(160, totalCalories);
}