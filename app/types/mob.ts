interface Image {
  id: string;
  url: string;
  title: string;
}

interface CategoryItem {
  id: string;
  title: string;
  uri: string | null;
  groupHandle: string;
}

interface Chef extends CategoryItem {
  summary: string;
  image: Image[];
}

interface Cost {
  id: string;
  title: string;
  uri: null;
  groupHandle: 'costs';
}

interface Unit {
  id: string;
  title: string;
  uri: string | null;
  groupHandle: 'units';
  plural: string;
  shorthand: string;
}

interface Ingredient {
  id: string;
  title: string;
  uri: string;
  groupHandle: 'ingredients';
  plural: string;
  overrideNutritionalInformation: boolean;
  volumeToMassConversion: number | null;
  massPerUnit: number | null;
  calories: number | null;
  fat: number | null;
  saturatedFat: number | null;
  carbohydrates: number | null;
  sugars: number | null;
  dietaryFibre: number | null;
  protein: number | null;
  sodium: number | null;
}

interface RecipeIngredient {
  id: string;
  typeHandle: 'ingredient';
  label: string;
  quantity: string | null;
  toServe: boolean;
  unit?: Unit[];
  ingredient?: Ingredient[];
}

interface MethodStep {
  id: string;
  typeHandle: 'step';
  heading: null | string;
  description: string;
  time: null | number;
  brightcoveVideoId: null | string;
}

interface RelatedMusic {
  id: string;
  slug: string;
  title: string;
  uri: null | string;
  sectionHandle: string;
  typeHandle: 'music';
  postDate: string;
  status: string;
  spotifyUri: string;
}

interface CtaTarget {
  element: null | string;
  url: null | string;
  type: string;
  title: null | string;
  text: string;
  target: null | string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  uri: string;
  sectionHandle: string;
  typeHandle: string;
  postDate: string;
  status: string;
  redirectTo: null | string;
  heroTitle: string;
  summary: string;
  image: Image[];
  cuisines: CategoryItem[];
  brands: any[];
  chefs?: Chef[];
  creatorProgrammeContent: boolean;
  isMonetized: boolean;
  dietaryRequirements: CategoryItem[];
  types: CategoryItem[];
  complexity: CategoryItem[];
  meals: CategoryItem[];
  occasions: any[];
  time: number;
  cost: Cost[];
  brightcoveVideoId: string;
  notes: string;
  keywords: null | string;
  servingSize: number;
  recipeIngredients?: RecipeIngredient[];
  method?: MethodStep[];
  relatedMusic: RelatedMusic[];
  averageRating: string;
  averageRepeatRating: string;
  ctaEnabled: boolean;
  ctaHeading: null | string;
  ctaContent: null | string;
  ctaImage: any[];
  ctaTarget: CtaTarget;
  ctaBackgroundColor: null | string;
  ctaTextColor: null | string;
  colourway: any[];
  accessLevel: string;
  hideAds: boolean;
  cookTime: null | number;
  prepTime: null | number;
  usefulInfo: null | string;
  recipeFaqs: any[];
  usefulLinks: any[];
  youMightLikeHeading: null | string;
  youMightLikeCarouselItems: any[];
}