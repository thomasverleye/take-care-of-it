import { Fragment } from "react/jsx-runtime";
import type { Route } from "./+types/slug";
import type { Recipe } from "~/types/mob";
import simplifyRecipe from "~/utils/simplifyRecipe";

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data.recipe.title },
    { name: "description", content: data.recipe.summary },
  ];
}

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
    return { recipe: simplifyRecipe(fullRecipe) };
    
  } catch (error) {
    console.error('Error fetching or compiling recipe:', error);
    throw new Response("Recipe not found", { status: 404 });
  }
}

export default function Recipe({ loaderData: { recipe } }: Route.ComponentProps) {  
  return (
    <>
      <section className="c-hero u-background u-grid">
        <div className="c-hero__content">
          <h1>{recipe.title}</h1>

          {/* Summary */}
          <p>{recipe.summary}</p>

          <div className="t-small">
            {/* Chefs */}
            {recipe.chefs?.map(chef => (
              <Fragment key={chef.title}>
                {/* Chef Content */}
                <div className="c-chefs">
                  {chef.image?.[0] && (
                    <img
                      className="c-chefs__image"
                      src={chef.image[0].url} 
                      alt={chef.title}
                    />
                  )}
                  <p className="c-chefs__title"><strong>{chef.title}</strong></p>
                </div>
              </Fragment>
            ))}
            
            {/* Meta Information */}
            <p>This recipe:</p>
            <ul>
              <li>will take <strong>{recipe.time} minutes</strong> to make</li>
              <li>serves <strong>{recipe.servingSize} people</strong></li>
              {recipe.averageRating && recipe.averageRating !== '0' && <li>has a rating of <strong>{recipe.averageRating}</strong> out of 5 stars</li>}
          </ul>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="c-hero__image">
          {recipe.image?.[0] && (
            <img 
              src={recipe.image[0].url} 
              alt={recipe.title}
            />
          )}
        </div>
      </section>
      
      <section className="c-recipe u-background u-grid">
        {/* Ingredients */}
        <div className="c-recipe__ingredients">
          <h2>Ingredients</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recipe.recipeIngredients?.map((item, index) => item.type == 'ingredient' ? (
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
              ) : (
                <tr key={index}>
                  <td className="u-table-cell-inverted" colSpan={2}>{item.heading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      
        {/* Method */}
        <div className="c-recipe__method">
          <h2>Method</h2>
          <ol>
            {recipe.method?.map((step, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: step.description }} />
            ))}
          </ol>
        </div>
      </section>
    </>
  );
} 