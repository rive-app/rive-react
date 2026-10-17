import type { Meta, StoryObj } from '@storybook/react';

import MultipleInstances from './MultipleInstances';

const meta = {
  title: 'MultipleInstances',
  component: MultipleInstances,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MultipleInstances>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};