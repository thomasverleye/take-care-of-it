import { useCallback, useRef, useState } from "react";
import type { Route } from "./+types/home";

export function loader() {
  return {
    appUrl: process.env?.APP_URL ?? 'http://localhost:5173',
  }
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
      <p>Try out a bookmarklet to take care of the recipe even faster!</p>
      <label htmlFor="bookmarklet">The bookmarklet code</label>
      <textarea id="bookmarklet" ref={textareaRef}>{`javascript:window.location.replace('${loaderData.appUrl}/'+window.location.href.split('/recipes/')[1].split('/')[0])`}</textarea>
      <button type="button" onClick={clickHandler}>Copy code</button>
      <div aria-live="polite">{message && <p>{message}</p>}</div>
    </>
  )
}