import { useEffect, useState } from "react";
import searchBoxJson from "../../../../../figmafiles/SearchBox-Default.json";

interface InputStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  width: number;
  height: number;
}

interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Typography {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

interface ButtonStyle {
  backgroundColor: string;
  borderRadius: number;
  padding: Padding;
  width: number;
  height: number;
  typography: Typography;
  textColor: string;
  text: string;
}

interface SearchBoxStyle {
  input: InputStyle;
  button: ButtonStyle;
}

export function SearchBox() {
  const [style, setStyle] = useState<SearchBoxStyle | null>(null);

  useEffect(() => {
    const currentStyle = searchBoxJson.searchBox.default;
    setStyle(currentStyle || null);
  }, []);

  if (!style) return <div>Loading...</div>;

  const buttonPadding = `${style.button.padding.top}px ${style.button.padding.right}px ${style.button.padding.bottom}px ${style.button.padding.left}px`;

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <input
        style={{
          backgroundColor: style.input.backgroundColor,
          borderColor: style.input.borderColor,
          borderWidth: style.input.borderWidth,
          borderStyle: "solid",
          width: style.input.width,
          height: style.input.height,
          padding: "0 12px",
          fontSize: "16px",
        }}
        placeholder="Search..."
      />

      <button
        style={{
          backgroundColor: style.button.backgroundColor,
          borderRadius: style.button.borderRadius,
          width: style.button.width,
          height: style.button.height,
          padding: buttonPadding,
          fontFamily: style.button.typography.fontFamily,
          fontWeight: style.button.typography.fontWeight,
          fontSize: `${style.button.typography.fontSize}px`,
          lineHeight: `${style.button.typography.lineHeight}px`,
          letterSpacing: `${style.button.typography.letterSpacing}px`,
          color: style.button.textColor,
        }}
      >
        {style.button.text}
      </button>
    </div>
  );
}