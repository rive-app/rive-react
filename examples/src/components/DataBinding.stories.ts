import type { Meta, StoryObj } from '@storybook/react';

import DataBinding from './DataBinding';

const meta = {
  title: 'DataBinding',
  component: DataBinding,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof DataBinding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
