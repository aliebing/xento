import 'server-only';
import type { Locale } from './config';
import type en from './dictionaries/en.json';

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> => dictionaries[locale]();
