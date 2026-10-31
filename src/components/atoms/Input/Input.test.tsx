import type { ReactElement } from 'react';
import { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { composeStories } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Input } from './Input';
import * as stories from './Input.stories';

const { Playground, Invalid, Disabled, WithAdornments } = composeStories(stories);

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

const part = (name: string) =>
  container.querySelector(`[data-scope="input"][data-part="${name}"]`);

describe('Input edge cases', () => {
  test('defaults to the md variantSize and the text type', async () => {
    await mount(<Input aria-label="Name" />);
    expect(part('root')?.getAttribute('data-size')).toBe('md');
    expect(part('input')?.getAttribute('type')).toBe('text');
  });

  test('native size and prefix reach the input, variantSize stays on the root', async () => {
    await mount(<Input aria-label="Code" variantSize="lg" size={6} prefix="schema:" />);
    expect(part('root')?.getAttribute('data-size')).toBe('lg');
    expect((part('input') as HTMLInputElement | null)?.size).toBe(6);
    expect(part('input')?.getAttribute('prefix')).toBe('schema:');
  });

  test('invalid sets aria-invalid on the input and data-invalid on the root', async () => {
    await mount(<Invalid />);
    expect(part('input')?.getAttribute('aria-invalid')).toBe('true');
    expect(part('root')?.hasAttribute('data-invalid')).toBe(true);
  });

  test('a valid input carries neither aria-invalid nor data-invalid', async () => {
    await mount(<Playground />);
    expect(part('input')?.hasAttribute('aria-invalid')).toBe(false);
    expect(part('root')?.hasAttribute('data-invalid')).toBe(false);
  });

  test('adornments render in their slots, around the input', async () => {
    await mount(<WithAdornments />);
    const roots = container.querySelectorAll('[data-scope="input"][data-part="root"]');
    const [website, , amount] = [...roots];
    const start = website.querySelector('[data-part="start"]');
    const end = amount.querySelector('[data-part="end"]');
    expect(start?.textContent).toBe('https://');
    expect(start?.nextElementSibling?.getAttribute('data-part')).toBe('input');
    expect(end?.textContent).toBe('EUR');
    expect(end?.previousElementSibling?.getAttribute('data-part')).toBe('input');
    expect(website.querySelector('[data-part="end"]')).toBeNull();
  });

  test('className and style land on the root, every other prop on the input', async () => {
    await mount(
      <Input
        aria-label="Email"
        className="custom"
        style={{ maxInlineSize: '20rem' }}
        id="email"
        name="email"
        autoComplete="email"
      />,
    );
    const rootEl = part('root') as HTMLElement | null;
    const input = part('input') as HTMLInputElement | null;
    expect(rootEl?.classList.contains('custom')).toBe(true);
    expect(rootEl?.style.maxInlineSize).toBe('20rem');
    expect(input?.classList.contains('custom')).toBe(false);
    expect(input?.getAttribute('style')).toBeNull();
    expect(input?.id).toBe('email');
    expect(input?.name).toBe('email');
    expect(input?.getAttribute('aria-label')).toBe('Email');
    expect(input?.autocomplete).toBe('email');
  });

  test('ref reaches the native input, not the wrapper', async () => {
    const ref = createRef<HTMLInputElement>();
    await mount(<Input aria-label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(part('input'));
  });

  test('a disabled input does not receive typed text', async () => {
    await mount(<Disabled />);
    const input = part('input') as HTMLInputElement;
    await userEvent.type(input, 'xyz');
    expect(input.value).toBe('ada@example.com');
    expect(input.disabled).toBe(true);
    expect(part('root')?.hasAttribute('data-disabled')).toBe(true);
  });
});
