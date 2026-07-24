import type { Meta, StoryObj } from '@storybook/react';

import GlobalViewModelInstance from './DataBindingHooks';

const meta = {
  title: 'Data Binding - Globals (with hooks)',
  component: GlobalViewModelInstance,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof GlobalViewModelInstance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
