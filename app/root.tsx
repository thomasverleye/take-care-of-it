import {
  isRouteErrorResponse,
  Links,
  LinksFunction,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import styles from "./app.css?url";

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ]
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Take care of it" },
    { name: "description", content: "Get the ingredients and instructions from the Mob." },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const url = formData.get("url");

  if (typeof url !== 'string') {
    throw new Error('STAPH');
  }

  if (!url || !url.startsWith('https://www.mob.co.uk/recipes/')) {
    return {
      errors: {
        url: 'Incorrect url, it needs to start with https://www.mob.co.uk/recipes/',
      },
      values: {
        url,
      },
    };
  }

  const slug = url.split('/recipes/')[1].split('/')[0];
  throw redirect(`/${slug}`);
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ actionData }: Route.ComponentProps) {
  const error = actionData?.errors?.url;
  const value = actionData?.values?.url;
  return (
    <>
      <main>
        <form action="/" method="post" className="c-form u-grid u-background">
          <label className="c-form__label" htmlFor="url">Mob kitchen URL</label>
          <div className="c-form__input">  
            <input 
              aria-describedby={error ? "url-error" : undefined}
              aria-invalid={error ? true : undefined}
              defaultValue={value}
              id="url" 
              name="url"
              type="url" 
            />
            {error && (
              <p id="url-error" className="error">
                {error}
              </p>
            )}
          </div>
          <button className="c-form__action" type="submit">Take care of it</button>
        </form>
        <Outlet />
      </main>
    </>
  );
}


export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
