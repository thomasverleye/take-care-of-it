import { Recipe } from "~/types/mob";

interface Ingredient {
  type: 'ingredient';
  quantity: number | null;
  unit?: Array<{ title: string; plural: string }>;
  ingredient: Array<{ title: string; plural: string }>;
}

interface Heading {
  type: 'heading';
  heading: string;
}

interface SimplifiedRecipe {
  title: string;
  summary: string;
  image?: Array<{ url: string }>;
  chefs?: Array<{ title: string; summary: string, image?: Array<{ url: string }>}>;
  time: number;
  servingSize: number;
  averageRating: string;
  recipeIngredients?: Array<Ingredient | Heading>;
  method?: Array<{ description: string }>;
}

// Then create a function to transform the data
export default function simplifyRecipe(recipe: Recipe): SimplifiedRecipe {
  return {
    title: recipe.title,
    summary: recipe.summary,
    image: recipe.image?.map(img => ({ url: img.url })),
    chefs: recipe.chefs?.map(chef => ({
      title: chef.title,
      summary: chef.summary,
      image: chef.image?.map(img => ({ url: img.url })),
    })),
    time: recipe.time,
    servingSize: recipe.servingSize,
    averageRating: recipe.averageRating,
    recipeIngredients: recipe.recipeIngredients?.map(ingredient => (ingredient?.typeHandle === 'ingredient' ? {
      type: 'ingredient',
      quantity: !!ingredient.quantity ? parseInt(ingredient.quantity, 10) : null,
      unit: ingredient.unit?.map(u => ({
        title: u.title,
        plural: u.plural
      })),
      ingredient: ingredient.ingredient?.map(i => ({
        title: i.title,
        plural: i.plural
      }))
    } as Ingredient : {
      type: 'heading',
      heading: ingredient.heading,
    } as Heading)),
    method: recipe.method?.map(step => ({
      description: step.description
    }))
  };
}