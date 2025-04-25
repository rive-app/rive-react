import type { Meta, StoryObj } from '@storybook/react';

import ResponsiveLayout from './ResponsiveLayout';

const meta = {
  title: 'ResponsiveLayout',
  component: ResponsiveLayout,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof ResponsiveLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
