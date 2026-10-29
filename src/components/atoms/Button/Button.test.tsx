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

describe('Button override contract', () => {
  test('exposes data-scope/data-part on each part and reflects intent/size', async () => {
    await mount(<Playground intent="danger" size="lg" />);
    const root = container.querySelector('[data-scope="button"][data-part="root"]');
    const button = container.querySelector('[data-scope="button"][data-part="button"]');
    const label = container.querySelector('[data-scope="button"][data-part="label"]');
    expect(root).not.toBeNull();
    expect(button?.tagName).toBe('BUTTON');
    expect(label?.textContent).toBe('Button');
    expect(button?.getAttribute('data-intent')).toBe('danger');
    expect(button?.getAttribute('data-size')).toBe('lg');
  });

  test('loading reflects data-loading/data-disabled and exposes the spinner part', async () => {
    await mount(<Loading />);
    const button = container.querySelector('[data-part="button"]');
    const spinner = container.querySelector('[data-scope="button"][data-part="spinner"]');
    expect(button?.hasAttribute('data-loading')).toBe(true);
    expect(button?.hasAttribute('data-disabled')).toBe(true);
    expect(spinner).not.toBeNull();
  });

  test('disabled reflects data-disabled without data-loading', async () => {
    await mount(<Disabled />);
    const button = container.querySelector('[data-part="button"]');
    expect(button?.hasAttribute('data-disabled')).toBe(true);
    expect(button?.hasAttribute('data-loading')).toBe(false);
  });
});
