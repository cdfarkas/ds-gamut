import type { ReactElement } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { composeStories } from '@storybook/react-vite';
import { fn, userEvent } from 'storybook/test';
import * as stories from './Button.stories';

const { Loading, Disabled, Playground } = composeStories(stories);

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

  test('loading spinner has a running spin animation', async () => {
    await mount(<Loading />);
    const spinner = container.querySelector('[aria-hidden="true"]');
    const anim = spinner ? getComputedStyle(spinner).animationName : 'none';
    expect(anim).not.toBe('none');
    expect(anim).not.toBe('');
  });

  test('disabled button does not fire onClick', async () => {
    const onClick = fn();
    await mount(<Disabled onClick={onClick} />);
    const button = container.querySelector('button');
    if (button) await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('intent is live: changing it swaps the variant class', async () => {
    await mount(<Playground intent="primary" />);
    const primary = container.querySelector('button')?.className;
    await mount(<Playground intent="danger" />);
    const danger = container.querySelector('button')?.className;
    expect(primary).toBeTruthy();
    expect(primary).not.toBe(danger);
  });
});
