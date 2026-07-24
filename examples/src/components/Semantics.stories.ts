import type { Meta, StoryObj } from '@storybook/react';

import Semantics from './Semantics';

const meta = {
  title: 'Semantics',
  component: Semantics,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof Semantics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
