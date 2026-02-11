import type { Meta, StoryObj } from "@storybook/react";
import { SearchBox } from "./SearchBox";

const meta: Meta<typeof SearchBox> = {
  title: "Design System/SearchBox",
  component: SearchBox,
};

export default meta;

type Story = StoryObj<typeof SearchBox>;

export const Default: Story = {};