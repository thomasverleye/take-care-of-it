import {
  Form,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const url = formData.get("url");

  if (!url || typeof url !== 'string' || !url.startsWith('https://www.mob.co.uk/recipes/')) {
    return {
      errors: {
        url: 'Incorrect url, it needs to start with https://www.mob.co.uk/recipes/',
      }
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
  const urlError = actionData?.errors?.url;
  
  return (
    <>
      <Form method="post">
        <label htmlFor="url">Mob Kitchen url</label>
        <input 
          id="url" 
          type="url" 
          name="url"
          aria-invalid={urlError ? true : undefined}
          aria-describedby={urlError ? "url-error" : undefined}
        />
        {urlError && (
          <p id="url-error" className="error">
            {urlError}
          </p>
        )}
        <button type="submit">Take care of it</button>
      </Form>
      <main>
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
