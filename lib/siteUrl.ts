const FALLBACK = 'https://xento-phi.vercel.app';

/**
 * Basis für absolute URLs (canonical, hreflang, OpenGraph).
 * Nur der Ursprung zählt: Steht in NEXT_PUBLIC_SITE_URL ein Pfad wie `/de`,
 * würde Next ihn vor jede relative URL setzen (`/de/de`) – LinkedIn & Co. landen dann auf 404.
 */
export function siteOrigin(value: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): URL {
  try {
    return new URL(new URL(value?.trim() || FALLBACK).origin);
  } catch {
    return new URL(FALLBACK);
  }
}
