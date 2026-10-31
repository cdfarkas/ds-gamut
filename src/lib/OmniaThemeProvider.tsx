import { createContext, useContext, useEffect, type ReactNode } from 'react';

export const themes = ['light', 'dark'] as const;
export type Theme = (typeof themes)[number];

export const skins = ['default', 'pixel'] as const;
export type Skin = (typeof skins)[number];

export interface ThemeState {
  theme: Theme;
  skin: Skin;
}

const ThemeContext = createContext<ThemeState>({ theme: 'light', skin: 'default' });

interface OmniaThemeProviderProps extends Partial<ThemeState> {
  children?: ReactNode;
}

/**
 * Omnia's single theming mechanism: sets `data-theme`/`data-skin` on the document root so the
 * semantic token layer resolves, and exposes the active pair through `useTheme()`. One active
 * theme per document — the attributes live on the root (ADR 0017).
 */
export function OmniaThemeProvider({
  theme = 'light',
  skin = 'default',
  children,
}: OmniaThemeProviderProps): ReactNode {
  useEffect(() => {
    const { documentElement } = document;
    documentElement.setAttribute('data-theme', theme);
    documentElement.setAttribute('data-skin', skin);
  }, [theme, skin]);

  return <ThemeContext value={{ theme, skin }}>{children}</ThemeContext>;
}

/** Read the active theme and skin from the nearest OmniaThemeProvider. */
export function useTheme(): ThemeState {
  return useContext(ThemeContext);
}
