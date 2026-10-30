import { afterEach } from 'vitest';
import type { A11yReport } from '@storybook/addon-a11y';

type Report = { type: string; status: string; result: A11yReport };

// addon-a11y fails only on violations; axe "incomplete" (needs review) results must fail too.
afterEach(({ task }) => {
  const reports = (task.meta as { reports?: Report[] }).reports;
  const a11y = reports?.find((report) => report.type === 'a11y');
  if (!a11y || a11y.status === 'warning' || !('incomplete' in a11y.result)) return;
  const { incomplete } = a11y.result;
  if (incomplete.length === 0) return;
  const { theme, skin } = document.documentElement.dataset;
  const details = incomplete.map(
    ({ id, help, nodes }) =>
      `- ${id}: ${help}\n${nodes.map((node) => `    ${node.target.join(' ')}: ${node.failureSummary ?? ''}`).join('\n')}`,
  );
  throw new Error(
    `axe returned ${incomplete.length} incomplete (needs review) result(s) in theme=${theme} skin=${skin}:\n${details.join('\n')}`,
  );
});
