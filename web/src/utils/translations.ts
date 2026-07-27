// web/src/utils/translation.ts
export const INGREDIENT_TRANSLATIONS: Record<string, string> = {
  "chicken": "kip",
  "beef": "rundvlees",
  "pork": "varkensvlees",
  "fish": "vis",
  "shrimp": "garnalen",
  "prawn": "garnalen",
  "crab": "krab",
  "salted fish": "zoute vis",
  "zoutvlees": "zoutvlees",
  "bakkeljauw": "bakkeljauw",
  "rice": "rijst",
  "brown rice": "zilvervliesrijst",
  "black-eyed pea": "zwarte-ogenboon",
  "kidney bean": "kidneyboon",
  "black bean": "zwarte boon",
  "potato": "aardappel",
  "sweet potato": "zoete aardappel",
  "cassava": "cassave",
  "taro": "taro",
  "plantain": "bakbanaan",
  "banana": "banaan",
  "tomato": "tomaat",
  "onion": "ui",
  "garlic": "knoflook",
  "scallion": "lente-ui",
  "celery": "selderij",
  "bell pepper": "paprika",
  "coconut milk": "kokosmelk",
  "coconut cream": "kokosroom",
  "coconut oil": "kokosolie",
  "palm oil": "palmolie",
  "okra": "okra",
  "eggplant": "aubergine",
  "pumpkin": "pompoen",
  "spinach": "spinazie",
  "cabbage": "kool",
  "green bean": "sperzieboon",
  "kouseband": "kouseband",
  "yardlong bean": "kouseband",
  "breadfruit": "broodvrucht",
  "corn": "maïs",
  "peanut": "pinda",
  "peanut butter": "pindakaas",
  "cashew": "cashewnoot",
  "salt": "zout",
  "pepper": "peper",
  "turmeric": "kurkuma",
  "curry powder": "kerriepoeder",
  "masala": "masala",
  "cumin": "komijn",
  "ginger": "gember",
  "thyme": "tijm",
  "parsley": "peterselie",
  "cilantro": "koriander",
  "coriander": "koriander",
  "scotch bonnet": "adjuma",
  "habanero": "habanero",
  "madame jeanette": "madame jeanette",
  "adjuma": "adjuma",
  "soy sauce": "ketjap",
  "dark soy sauce": "donkere ketjap",
  "light soy sauce": "lichte ketjap",
  "ketjap": "ketjap",
  "flour": "bloem",
  "bread": "brood",
  "egg": "ei",
  "milk": "melk",
  "butter": "boter",
  "cheese": "kaas",
  "yogurt": "yoghurt",
  "sugar": "suiker",
  "brown sugar": "bruine suiker",
  "honey": "honing",
  "vanilla": "vanille",
  "cinnamon": "kaneel",
  "nutmeg": "nootmuskaat",
  "noodles": "noedels",
  "pasta": "pasta",
  "vermicelli": "vermicelli",
  "spaghetti": "spaghetti",
  "macaroni": "macaroni"
};

export function translateIngredient(eng: string): string {
  const lower = eng.toLowerCase().trim();
  
  if (INGREDIENT_TRANSLATIONS[lower]) {
    return INGREDIENT_TRANSLATIONS[lower];
  }

  for (const [key, value] of Object.entries(INGREDIENT_TRANSLATIONS)) {
    if (lower.includes(key)) {
      return value;
    }
  }

  return eng;
}