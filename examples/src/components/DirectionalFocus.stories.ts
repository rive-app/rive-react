import type { Meta, StoryObj } from '@storybook/react';

import DirectionalFocus from './DirectionalFocus';

const meta = {
  title: 'Directional Focus',
  component: DirectionalFocus,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof DirectionalFocus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  name: 'Grid 1–9 (arrow keys)',
};
