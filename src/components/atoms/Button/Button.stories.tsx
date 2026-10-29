import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  args: {
    children: 'Button',
    intent: 'primary',
    size: 'md',
    onClick: fn(),
  },
  argTypes: {
    intent: {
      control: 'inline-radio',
      options: ['primary', 'neutral', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    chromatic: {
      modes: {
        'light-neutral': { theme: 'light', skin: 'default' },
        'dark-neutral': { theme: 'dark', skin: 'default' },
        'light-pixel': { theme: 'light', skin: 'pixel' },
        'dark-pixel': { theme: 'dark', skin: 'pixel' },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ['interaction'],
  play: async ({ canvas, args, step }) => {
    const button = canvas.getByRole('button', { name: 'Button' });
    await step('clicking fires onClick', async () => {
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledOnce();
    });
  },
};

export const Neutral: Story = { args: { intent: 'neutral' } };

export const Danger: Story = { args: { intent: 'danger' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = { args: { disabled: true } };

export const DarkNeutral: Story = { globals: { theme: 'dark' } };

export const PixelLight: Story = { globals: { skin: 'pixel' } };

export const PixelDark: Story = { globals: { theme: 'dark', skin: 'pixel' } };
