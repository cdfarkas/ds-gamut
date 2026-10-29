import { useEffect, useState, type ReactNode } from 'react';
import { locales, type Locale } from './i18n';

type Globals = Record<string, unknown>;

interface StorybookPreview {
  channel?: {
    on(event: string, cb: (payload: unknown) => void): void;
    off(event: string, cb: (payload: unknown) => void): void;
  };
  storyStore?: { userGlobals?: { get(): Globals } };
}

const GLOBALS_UPDATED = 'globalsUpdated';

function preview(): StorybookPreview | undefined {
  return (globalThis as { __STORYBOOK_PREVIEW__?: StorybookPreview })
    .__STORYBOOK_PREVIEW__;
}

function readGlobals(): Globals {
  try {
    return preview()?.storyStore?.userGlobals?.get() ?? {};
  } catch {
    return {};
  }
}

/**
 * Live-read one toolbar global from inside a Docs/MDX page, attached or story-less.
 * Reads the preview's user-globals store, which resolves on page-level MDX where the
 * Docs story context does not, and re-reads it on every globals change.
 */
export function useGlobal(key: string): unknown {
  const [value, setValue] = useState<unknown>(() => readGlobals()[key]);

  useEffect(() => {
    const channel = preview()?.channel;
    if (!channel) return undefined;
    const onUpdate = () => setValue(readGlobals()[key]);
    channel.on(GLOBALS_UPDATED, onUpdate);
    return () => channel.off(GLOBALS_UPDATED, onUpdate);
  }, [key]);

  return value;
}

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Read the live `locale` toolbar global, falling back to English. */
export function useLocale(): Locale {
  const value = useGlobal('locale');
  return isLocale(value) ? value : 'en';
}

/** Render only the active locale's node, switching live with the `locale` toolbar global. */
export function Localized({ fr, en }: { fr: ReactNode; en: ReactNode }): ReactNode {
  return useLocale() === 'fr' ? fr : en;
}
