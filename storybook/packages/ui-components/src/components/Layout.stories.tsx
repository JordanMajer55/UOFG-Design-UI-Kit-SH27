import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";
import { SearchBox } from "./searchBox";
import { Logo } from "./Logo";

const meta: Meta = {
  title: "Final Layout",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "50px",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Logo />
        <Header />
      </div>

      <SearchBox />
    </div>
  ),
};
