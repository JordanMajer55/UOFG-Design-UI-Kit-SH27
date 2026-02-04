import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Design System/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

// Primary button story
export const Primary: Story = {
  args: {
    label: "Button",
    variant: "primary",
  },
};

// Secondary button story
export const Secondary: Story = {
  args: {
    label: "Button",
    variant: "secondary",
  },
};
