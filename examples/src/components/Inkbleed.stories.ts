import type { Meta, StoryObj } from '@storybook/react';

import Inkbleed from './Inkbleed';

const meta = {
  title: 'Inkbleed',
  component: Inkbleed,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof Inkbleed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
