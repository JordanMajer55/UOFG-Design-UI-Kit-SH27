import type { Meta, StoryObj } from "@storybook/react";
import { SearchBox } from "./searchBox";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta = {
  title: "Design System/PrototypePage",
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div
      style={{
        padding: "16px 24px",
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <SearchBox />
      <Breadcrumb />
      
    </div>
  ),
};


