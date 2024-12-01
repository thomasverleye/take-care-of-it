import { createRequestHandler } from "react-router";
import { CACHE_MAX_AGE, CDN_CACHE_MAX_AGE } from "../app/constants";

declare global {
  interface CloudflareEnvironment {}
}

declare module "react-router" {
  export interface AppLoadContext {
    env: CloudflareEnvironment & {
      APP_URL?: string;
    };
  }
}

const requestHandler = createRequestHandler(
  // @ts-expect-error - virtual module provided by React Router at build time
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env) {
    const cache = caches.default;
    const cacheKey = new Request(request.url, request);
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await requestHandler(request, { env });

    const cacheControl = response.headers.get("Cache-Control");
    if (cacheControl && cacheControl.includes("max-age")) {
      await cache.put(cacheKey, response.clone());
    }

    response.headers.set("Cache-Control", `public, max-age=${CACHE_MAX_AGE}`);
    response.headers.set("CDN-Cache-Control", `public, max-age=${CDN_CACHE_MAX_AGE}`);

    return response;
  },
} satisfies ExportedHandler<CloudflareEnvironment>;
