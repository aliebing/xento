export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function hasLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Wählt die beste unterstützte Sprache aus einem Accept-Language-Header.
 * Unbekannte Sprachen werden übersprungen, ohne brauchbaren Treffer gilt defaultLocale.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const parsed = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
      return {
        primary: tag.trim().toLowerCase().split('-')[0],
        quality: Number.isNaN(parsed) ? 0 : parsed,
        index,
      };
    })
    .filter((entry) => entry.primary !== '' && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const { primary } of ranked) {
    if (hasLocale(primary)) return primary;
  }
  return defaultLocale;
}

/** Tauscht das Sprachpräfix eines Pfads aus (oder setzt es, wenn keines da ist). */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  if (hasLocale(parts[0])) parts.shift();
  return `/${[target, ...parts].join('/')}`;
}
