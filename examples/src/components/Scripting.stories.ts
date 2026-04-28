import type { Meta, StoryObj } from '@storybook/react';

import ScriptedEffect from './Scripting';

const meta = {
  title: 'Scripting',
  component: ScriptedEffect,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof ScriptedEffect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
