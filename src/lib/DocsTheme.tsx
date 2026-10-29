import { useEffect } from 'react';
import { useGlobal } from './Localized';

/**
 * Mirror the live `theme`/`skin` toolbar globals onto <html> from a story-less Docs page.
 * Page-level MDX never triggers the theme decorator, so semantic token swatches would
 * otherwise freeze at the default theme; this keeps them reactive to the toolbars.
 */
export function ThemeSync(): null {
  const theme = useGlobal('theme');
  const skin = useGlobal('skin');

  useEffect(() => {
    if (typeof theme === 'string' && theme)
      document.documentElement.setAttribute('data-theme', theme);
    if (typeof skin === 'string' && skin)
      document.documentElement.setAttribute('data-skin', skin);
  }, [theme, skin]);

  return null;
}
