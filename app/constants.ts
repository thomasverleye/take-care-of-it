export const CACHE_MAX_AGE = 3600; // 1 hour
export const CDN_CACHE_MAX_AGE = 86400; // 1 day

export const DEFAULT_CACHE_HEADERS = {
  "Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
  "CDN-Cache-Control": `public, max-age=${CDN_CACHE_MAX_AGE}`
};