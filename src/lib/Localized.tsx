import { useContext, useEffect, useState, type ReactNode } from 'react';
import { DocsContext } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { locales, type Locale } from './i18n';

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Read the live `locale` toolbar global from inside a Docs/MDX page and re-render when it changes.
 * Preview hooks like `useGlobals` are unavailable in page-level MDX, so this reads the Docs channel.
 */
export function useLocale(): Locale {
  const docsContext = useContext(DocsContext);

  const read = (): Locale => {
    try {
      const { globals } = docsContext.getStoryContext(docsContext.storyById());
      return isLocale(globals.locale) ? globals.locale : 'en';
    } catch {
      return 'en';
    }
  };

  const [locale, setLocaleState] = useState<Locale>(read);

  useEffect(() => {
    const { channel } = docsContext;
    const onGlobals = ({ globals }: { globals: Record<string, unknown> }) => {
      if (isLocale(globals.locale)) setLocaleState(globals.locale);
    };
    channel.on(GLOBALS_UPDATED, onGlobals);
    return () => channel.off(GLOBALS_UPDATED, onGlobals);
  }, [docsContext]);

  return locale;
}

/** Render only the active locale's node, switching live with the `locale` toolbar global. */
export function Localized({ fr, en }: { fr: ReactNode; en: ReactNode }): ReactNode {
  return useLocale() === 'fr' ? fr : en;
}
