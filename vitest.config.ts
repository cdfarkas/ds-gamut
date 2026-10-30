import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const makeBrowser = () => ({
  enabled: true,
  provider: playwright(),
  headless: true,
  instances: [{ browser: 'chromium' as const }],
});

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: '.storybook' })],
        test: {
          name: 'storybook',
          browser: makeBrowser(),
        },
      },
      {
        extends: true,
        plugins: [react()],
        test: {
          name: 'unit',
          browser: makeBrowser(),
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: ['./vitest.unit-setup.ts'],
        },
      },
    ],
  },
});
