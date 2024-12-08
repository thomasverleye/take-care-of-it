import { useCallback, useRef, useState } from "react";
import type { Route } from "./+types/home";
import { data } from "react-router";
import { DEFAULT_CACHE_HEADERS } from "~/constants";

export function headers({
  actionHeaders,
  loaderHeaders,
}: Route.HeadersArgs) {
  return actionHeaders ? actionHeaders : loaderHeaders;
}

export function loader({ context }: Route.LoaderArgs) {
  return data({
    appUrl: context.env.APP_URL ?? process.env?.APP_URL ?? 'http://localhost:5173',
  }, {
    headers: { ...DEFAULT_CACHE_HEADERS },
  });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [message, setMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const clickHandler = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!textareaRef.current) {
        return;
      }

      navigator.clipboard
        .writeText(textareaRef.current.value)
        .then(() => {
          setMessage('Code copied');
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        })
        .catch((err) => {
          console.error(`Error copying input to clipboard: ${err}`);
          setMessage('Something went wrong');
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        });
    },
    [],
  );
  return (
    <>
    {/* Steps */}
    <section className="u-space-inline-m">
      <p>Mob recipes without ads or need to login</p>
      <ol>
        <li>Copy the <a href="https://www.mob.co.uk/home">Mob</a> url (for example: <em>https://www.mob.co.uk/recipes/veggie-satay-noodles</em>)</li>
        <li>Paste it in the form above</li>
        <li>...</li>
        <li>Profit!</li>
      </ol>
    </section>
    {/* Bookmarklet */}
    <section className="c-form c-form--align-start u-grid u-background">
      <p className="c-form__intro">Try out the bookmarklet to take care of the recipe even faster!</p>
      <label className="c-form__label" htmlFor="bookmarklet">Bookmarklet</label>
      <div className="c-form__input">
        <textarea id="bookmarklet" ref={textareaRef} defaultValue={`javascript:window.location.replace('${loaderData.appUrl}/'+window.location.href.split('/recipes/')[1].split('/')[0])`} readOnly></textarea>
      </div>
      <div className="c-form__action">
        <button type="button" onClick={clickHandler}>Copy code</button>
        <p aria-live="polite">{message && <span>{message}</span>}</p>
      </div>
    </section>
    </>
  )
}
