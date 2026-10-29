import { describe, expect, test } from 'vitest';
import { getLocale, setLocale, t } from './i18n';

describe('t()', () => {
  test('resolves against the current locale', () => {
    setLocale('fr');
    expect(getLocale()).toBe('fr');
    expect(t('button.loading')).toBe('Chargement');
    setLocale('en');
    expect(t('button.loading')).toBe('Loading');
  });

  test('an explicit locale argument overrides the current one', () => {
    setLocale('en');
    expect(t('button.loading', 'fr')).toBe('Chargement');
  });
});
