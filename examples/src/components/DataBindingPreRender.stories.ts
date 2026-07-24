import type { Meta, StoryObj } from '@storybook/react';

import GlobalViewModels from './DataBindingPreRender';

const meta = {
  title: 'Data Binding - Globals (setup before first frame)',
  component: GlobalViewModels,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof GlobalViewModels>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
