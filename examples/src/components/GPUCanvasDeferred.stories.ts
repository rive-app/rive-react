import type { Meta, StoryObj } from '@storybook/react';

import GPUCanvasDeferred from './GPUCanvasDeferred';

const meta = {
  title: 'GPUCanvasDeferred',
  component: GPUCanvasDeferred,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof GPUCanvasDeferred>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
