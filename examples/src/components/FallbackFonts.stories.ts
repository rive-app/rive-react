import type { Meta, StoryObj } from '@storybook/react';

import FallbackFonts from './FallbackFonts';

const meta = {
  title: 'FallbackFonts',
  component: FallbackFonts,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof FallbackFonts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
