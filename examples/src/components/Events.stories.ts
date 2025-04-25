import type { Meta, StoryObj } from '@storybook/react';

import Events from './Events';

const meta = {
  title: 'Events',
  component: Events,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof Events>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
