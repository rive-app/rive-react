import type { Meta, StoryObj } from '@storybook/react';

import BareBonesRiveCanvas from './Example';

const meta = {
  title: 'Components/BareBonesRiveCanvas',
  component: BareBonesRiveCanvas,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof BareBonesRiveCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
