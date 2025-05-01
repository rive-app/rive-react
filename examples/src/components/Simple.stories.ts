import type { Meta, StoryObj } from '@storybook/react';

import Simple from './Simple';

const meta = {
  title: 'Simple',
  component: Simple,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof Simple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
