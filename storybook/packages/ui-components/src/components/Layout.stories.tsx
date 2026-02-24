import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";
import { SearchBox } from "./searchBox";
import { PhaseBanner } from "./PhaseBanner";
import { Logo } from "./Logo";
import { Tabs } from "./Tabs";

const meta: Meta = {
  title: "Final Layout",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div
      style={{
        padding: "12px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        maxWidth: "1100px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", transform: "scale(0.9)", transformOrigin: "left" }}>
        <PhaseBanner />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ transform: "scale(0.8)", transformOrigin: "left" }}>
          <Logo />
        </div>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div style={{ transform: "scale(0.85)", transformOrigin: "right" }}>
            <Header />
          </div>

          <div
            style={{
              width: "100%",
              transform: "scale(0.85)",
              transformOrigin: "right",
            }}
          >
            <SearchBox />
          </div>
        </div>
      </div>

      <div style={{ width: "100%" }}>
        <Tabs />
      </div>
    </div>
  ),
};