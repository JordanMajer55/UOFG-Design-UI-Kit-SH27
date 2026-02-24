import type { Meta, StoryObj } from "@storybook/react";
import { PhaseBanner } from "./PhaseBanner";

const meta: Meta<typeof PhaseBanner> = {
  title: "Components/PhaseBanner",
  component: PhaseBanner,
};

export default meta;

export const Default: StoryObj<typeof PhaseBanner> = {};