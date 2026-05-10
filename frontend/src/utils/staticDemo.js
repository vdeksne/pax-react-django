/**
 * When `VITE_STATIC_DEMO=true` at build time, the shop uses bundled JSON + `/public/demo/*` images
 * and does not call Django (Netlify-friendly, no DB).
 */
export function isStaticDemo() {
  return import.meta.env.VITE_STATIC_DEMO === "true";
}
