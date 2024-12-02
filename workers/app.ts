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
  fetch(request, env) {
    return requestHandler(request, { env });
  },
} satisfies ExportedHandler<CloudflareEnvironment>;
