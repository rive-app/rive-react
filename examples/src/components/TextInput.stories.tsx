import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { LoginForm, MultilineAndListeners } from './TextInput';

const meta = {
  title: 'Text Input',
  component: LoginForm,
  parameters: {
    layout: 'fullscreen',
  },
  args: { semantics: true },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginFormSemantics: Story = {
  name: 'Login form (semantics)',
};

export const LoginFormNoSemantics: Story = {
  name: 'Login form (no semantics)',
  args: { semantics: false },
};

export const MultilineAndListenersStory: Story = {
  name: 'Multiline + listeners',
  render: () => <MultilineAndListeners />,
};
