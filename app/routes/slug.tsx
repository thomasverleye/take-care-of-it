import { Fragment } from "react/jsx-runtime";
import type { Route } from "./+types/slug";
import type { Recipe } from "~/types/mob";
import simplifyRecipe from "~/utils/simplifyRecipe";

// Update the loader to use this transformation
export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  
  try {
    const response = await fetch(`https://www.mob.co.uk/recipes/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch recipe: ${response.statusText}`);
    }
    
    const htmlText = await response.text();
    const scriptRegex = /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/;
    const match = htmlText.match(scriptRegex);
    
    if (!match) {
      throw new Error('Could not find Next data in the page');
    }
    
    const jsonData = JSON.parse(match[1]);
        
    if (!jsonData?.props?.pageProps?.recipe) {
      throw new Error('Could not find recipe data in the page');
    }

    const fullRecipe: Recipe = jsonData.props.pageProps.recipe;
    
    // Transform the data before returning
    return { recipe: simplifyRecipe(fullRecipe) };
    
  } catch (error) {
    console.error('Error fetching or compiling recipe:', error);
    throw new Response("Recipe not found", { status: 404 });
  }
}

export default function Recipe({ loaderData: { recipe } }: Route.ComponentProps) {  
  return (
    <>
      <section>
        <h1>{recipe.title}</h1>

        {/* Summary */}
        <p>{recipe.summary}</p>
        
        {/* Meta Information */}
        <ul>
          <li>Will take {recipe.time} minutes to make</li>
          <li>Serves {recipe.servingSize} people</li>
          {recipe.averageRating && <li>Rating of {recipe.averageRating} of 5 stars</li>}
        </ul>
        
        {/* Hero Image */}
        {recipe.image?.[0] && (
          <img 
            src={recipe.image[0].url} 
            alt={recipe.title}
          />
        )}
      </section>
      
      {/* Ingredients */}
      <section>
        <h2>Ingredients</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Amount</th>
          </tr>
          {recipe.recipeIngredients?.map((item, index) => (
            <tr key={index}>
              <td>{item.ingredient?.[0]?.title}</td>
              <td>
                {item.quantity && (
                  <>
                    {`${item.quantity}`}
                    {item?.unit && item.unit[0] && ` ${item.quantity < 2 ? item.unit[0].title : item.unit[0].plural}`}
                  </>
                )}
              </td>
            </tr>
          ))}
        </table>
      </section>
      
      {/* Method */}
      <section>
        <h2>Method</h2>
        <ol>
          {recipe.method?.map((step, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: step.description }} />
          ))}
        </ol>
      </section>
      
      {/* Chefs */}
      {recipe.chefs && recipe.chefs.length > 0 && (
        <section>
          <h2>Chef{recipe.chefs.length > 1 ? 's' : ''}</h2>
          {recipe.chefs?.map(chef => (
            <Fragment key={chef.title}>
              <h3>{chef.title}</h3>
              <p>{chef.summary}</p>
            </Fragment>
          ))}
        </section>
      )}
    </>
  );
} 