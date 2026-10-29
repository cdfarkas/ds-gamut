import { en } from '../translations/en';
import { fr } from '../translations/fr';

export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export type TranslationKey = keyof typeof en;

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { en, fr };

let currentLocale: Locale = 'en';

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

/** Resolve a typed key to its string in the given (or current) locale, falling back to English. */
export function t(key: TranslationKey, locale: Locale = currentLocale): string {
  return dictionaries[locale][key] ?? dictionaries.en[key];
}
