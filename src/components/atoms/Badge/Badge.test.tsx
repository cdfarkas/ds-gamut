import type { ReactElement } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { composeStories } from '@storybook/react-vite';
import { Badge } from './Badge';
import * as stories from './Badge.stories';

const { Playground } = composeStories(stories);

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

async function mount(ui: ReactElement) {
  await act(async () => {
    root.render(ui);
  });
}

describe('Badge edge cases', () => {
  test('defaults to the neutral intent', async () => {
    await mount(<Badge>New</Badge>);
    const badge = container.querySelector('span');
    expect(badge?.getAttribute('data-intent')).toBe('neutral');
  });

  test('consumer className merges with the module class', async () => {
    await mount(<Playground className="custom" />);
    const badge = container.querySelector('span');
    expect(badge?.classList.contains('custom')).toBe(true);
    const moduleClasses = [...(badge?.classList ?? [])].filter((c) => c !== 'custom');
    expect(moduleClasses.length).toBeGreaterThan(0);
  });

  test('rest props reach the span', async () => {
    await mount(<Playground title="Status" id="status-badge" />);
    const badge = container.querySelector('span');
    expect(badge?.getAttribute('title')).toBe('Status');
    expect(badge?.id).toBe('status-badge');
  });

  test('intent is live: changing it swaps the variant class', async () => {
    await mount(<Playground intent="primary" />);
    const primary = container.querySelector('span')?.className;
    await mount(<Playground intent="danger" />);
    const danger = container.querySelector('span')?.className;
    expect(primary).toBeTruthy();
    expect(primary).not.toBe(danger);
  });

  test('every intent reflects data-intent and gets a distinct module class', async () => {
    const intents = [
      'primary',
      'neutral',
      'success',
      'warning',
      'info',
      'danger',
    ] as const;
    const classNames = new Set<string>();
    for (const intent of intents) {
      await mount(<Badge intent={intent}>{intent}</Badge>);
      const badge = container.querySelector('span');
      expect(badge?.getAttribute('data-intent')).toBe(intent);
      classNames.add(badge?.className ?? '');
    }
    expect(classNames.size).toBe(intents.length);
  });
});

describe('Badge override contract', () => {
  test('exposes data-scope/data-part on the root and reflects intent', async () => {
    await mount(<Playground intent="danger" />);
    const badge = container.querySelector('[data-scope="badge"][data-part="root"]');
    expect(badge?.tagName).toBe('SPAN');
    expect(badge?.getAttribute('data-intent')).toBe('danger');
    expect(badge?.textContent).toBe('Badge');
  });
});
