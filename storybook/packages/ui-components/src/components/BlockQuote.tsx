import React from "react";
import tokens from "../../../../../figmafiles/Blockquote.json";

type BlockQuoteProps = {
  text?: string;
};

export const BlockQuote: React.FC<BlockQuoteProps> = ({
  text,
}) => {
  const t = tokens?.blockquote?.default;

  if (!t) {
    console.error("BlockQuote tokens missing:", tokens);
    return <div>Token error</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: t.container.width,
        height: t.container.height,
        backgroundColor: t.container.backgroundColor || "transparent",
        paddingTop: t.container.padding.top ?? 0,
        paddingRight: t.container.padding.right ?? 0,
        paddingBottom: t.container.padding.bottom ?? 0,
        paddingLeft: t.container.padding.left ?? 0,
      }}
    >
      <div
        style={{
          color: t.icon.color,
          width: t.icon.width,
          height: t.icon.height,
          fontSize: t.icon.height,
        }}
      >
        “
      </div>

      <blockquote
        style={{
          margin: 0,
          color: t.text.color,
          fontFamily: t.text.typography.fontFamily,
          fontWeight: t.text.typography.fontWeight,
          fontSize: t.text.typography.fontSize,
          lineHeight: `${t.text.typography.lineHeight}px`,
          letterSpacing: `${t.text.typography.letterSpacing}px`,
        }}
      >
        {text ?? t.text.text}
      </blockquote>
    </div>
  );
};