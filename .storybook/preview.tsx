import type { Preview, Decorator } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { setLocale, type Locale } from '../src/lib/i18n';

import '@fontsource-variable/fraunces';
import '@fontsource-variable/space-grotesk';
import '../src/styles/layers.css';
import '../src/styles/reset.css';
import '../src/styles/tokens.css';
import '../src/styles/skins.css';

const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches;

const withSkin: Decorator = (Story, context) => {
  document.documentElement.setAttribute(
    'data-skin',
    String(context.globals.skin ?? 'default'),
  );
  return <Story />;
};

const withLocale: Decorator = (Story, context) => {
  setLocale((context.globals.locale ?? 'en') as Locale);
  return <Story />;
};

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      storySort: { order: ['Introduction', 'Atoms', '*'] },
    },
    a11y: {
      test: 'error',
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    },
  },
  globalTypes: {
    skin: {
      description: 'Visual skin',
      defaultValue: 'default',
      toolbar: {
        title: 'Skin',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Neutral' },
          { value: 'pixel', title: 'Pixel' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Locale',
      defaultValue: 'en',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'fr', title: 'Français' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: prefersDark ? 'dark' : 'light',
      attributeName: 'data-theme',
    }),
    withSkin,
    withLocale,
  ],
  tags: ['autodocs'],
};

export default preview;
