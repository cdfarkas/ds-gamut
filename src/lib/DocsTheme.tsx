import type { ReactNode } from 'react';
import { useGlobal } from './Localized';
import { OmniaThemeProvider } from './OmniaThemeProvider';

/**
 * Apply the live `theme`/`skin` toolbar globals from a story-less Docs/MDX page, where the story
 * decorator never runs. Routes through OmniaThemeProvider so docs and stories share one mechanism.
 */
export function ThemeSync(): ReactNode {
  const theme = useGlobal('theme');
  const skin = useGlobal('skin');
  return (
    <OmniaThemeProvider
      theme={theme === 'dark' ? 'dark' : 'light'}
      skin={skin === 'pixel' ? 'pixel' : 'default'}
    />
  );
}
