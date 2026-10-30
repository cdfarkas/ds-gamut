/** Every colour intent; each has a matching `[data-intent]` entry in the intent map (tokens.css). */
export const intents = [
  'primary',
  'neutral',
  'success',
  'warning',
  'info',
  'danger',
] as const;

/** A colour intent shared by every intent-coloured component. */
export type Intent = (typeof intents)[number];
