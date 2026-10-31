/**
 * ADR 0015 gate, run by `pnpm typecheck`: a prop of an exported component whose name is native
 * on any HTML element must take that native type (a narrower subset is fine). Not shipped.
 */
import type { JSX, ReactNode } from 'react';
import type * as Omnia from './index';

type HtmlTag = keyof HTMLElementTagNameMap & keyof JSX.IntrinsicElements;
type NativeName = { [T in HtmlTag]: keyof JSX.IntrinsicElements[T] }[HtmlTag];
type NativeType<K> = {
  [T in HtmlTag]: K extends keyof JSX.IntrinsicElements[T]
    ? JSX.IntrinsicElements[T][K]
    : never;
}[HtmlTag];

type Collisions<P> = {
  [K in keyof P & NativeName]-?: [Exclude<P[K], undefined>] extends [NativeType<K>]
    ? never
    : K;
}[keyof P & NativeName];

type Exports = typeof Omnia;
type ComponentProps = {
  [
    N in keyof Exports & string as N extends Capitalize<N>
      ? Exports[N] extends (props: never) => ReactNode
        ? N
        : never
      : never
  ]: Exports[N] extends (props: infer P) => ReactNode ? P : never;
};

type Message<
  N extends string,
  K,
> = `${N}.${K & string} reuses a native prop name with another type: rename it (ADR 0015)`;
type Violation = {
  [N in keyof ComponentProps]: Message<N, Collisions<ComponentProps[N]>>;
}[keyof ComponentProps];

export const nativePropNames: [Violation] extends [never] ? true : Violation = true;
