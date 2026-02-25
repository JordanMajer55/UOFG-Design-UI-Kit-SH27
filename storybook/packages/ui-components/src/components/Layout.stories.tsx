import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";
import { SearchBox } from "./searchBox";
import { PhaseBanner } from "./PhaseBanner";
import { Logo } from "./Logo";
import { Tabs } from "./Tabs";
import { Breadcrumb } from "./Breadcrumb";
import { BlockQuote } from "./BlockQuote";
import { Button } from "./Button";

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
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >

      {/* Top Bar: Logo + Nav + Search + Login */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div style={{ transform: "scale(0.9)", transformOrigin: "left" }}>
          <Logo />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div style={{ transform: "scale(0.9)", transformOrigin: "right" }}>
            <Header />
          </div>

          <div
            style={{
              width: "260px",
              transform: "scale(0.9)",
              transformOrigin: "right",
            }}
          >
            <SearchBox />
          </div>

          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Login
          </span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ width: "100%" }}>
        <Breadcrumb />
      </div>

      {/* Tabs */}
      <div style={{ width: "100%" }}>
        <Tabs />
      </div>

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "32px",
          marginTop: "24px",
        }}
      >
        {/* LEFT COLUMN: Image placeholder */}
        <div
          style={{
            flex: 1,
            background: "#d9d9d9",
            borderRadius: "8px",
            minHeight: "360px",
          }}
        />

        {/* RIGHT COLUMN */}
        <div
          style={{
            width: "420px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            The University of Glasgow Decolonising the Curriculum Community of Practice
          </h2>

          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Get involved
          </h1>

          {/* BlockQuote with your text */}
          <BlockQuote
            text={
              "If you'd like to get involved, please consider joining our community on Microsoft Teams.\n\n" +
              "If you have questions, you're also welcome to reach out to one of our co-leads."
            }
            style={{ maxWidth: "32px" }}

          />
        </div>
      </div>

      {/* ⭐ PhaseBanner moved BELOW the grey box */}
      <div style={{ width: "100%", marginTop: "32px" }}>
        <PhaseBanner />
      </div>

    </div>
  ),
};