import type { ReactElement } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { composeStories } from '@storybook/react-vite';
import { fn, userEvent } from 'storybook/test';
import * as stories from './Button.stories';

const { Loading, Disabled } = composeStories(stories);

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

describe('Button edge cases', () => {
  test('loading button is busy and disabled', async () => {
    await mount(<Loading />);
    const button = container.querySelector('button');
    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(button?.textContent).toContain('Loading');
  });

  test('disabled button does not fire onClick', async () => {
    const onClick = fn();
    await mount(<Disabled onClick={onClick} />);
    const button = container.querySelector('button');
    if (button) await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
