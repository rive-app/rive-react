import type { Meta, StoryObj } from '@storybook/react';

import Http from './Http';

const meta = {
  title: 'Http',
  component: Http,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof Http>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
