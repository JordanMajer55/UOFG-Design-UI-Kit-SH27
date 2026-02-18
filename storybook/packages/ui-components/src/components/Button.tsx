import { useEffect, useState } from "react";
import buttonPrimaryJson from "../../../../../figmafiles/Button.json";
import buttonSecondaryJson from "../../../../../figmafiles/Button-Secondary.json";

interface Padding { top: number; right: number; bottom: number; left: number; }
interface Typography { fontFamily: string; fontWeight: number; fontSize: number; lineHeight: number; letterSpacing: number; }
interface ButtonStyle { backgroundColor: string; borderRadius: number; width: number; height: number; padding: Padding; typography: Typography; }

interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
}

export function Button({ label, variant = "primary" }: ButtonProps) {
  const [style, setStyle] = useState<ButtonStyle | null>(null);

  useEffect(() => {
    const currentStyle =
      variant === "primary"
        ? buttonPrimaryJson.button.primary
        : buttonSecondaryJson.button.secondary;

    setStyle(currentStyle || null);
  }, [variant]);

  if (!style) return <button>Loading...</button>;

  const padding = style.padding
    ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
    : "0px";

  return (
    <button
      style={{
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        width: style.width,
        height: style.height,
        padding: padding,
        fontFamily: style.typography.fontFamily,
        fontWeight: style.typography.fontWeight,
        fontSize: `${style.typography.fontSize}px`,
        lineHeight: `${style.typography.lineHeight}px`,
        letterSpacing: `${style.typography.letterSpacing}px`,
        color: variant === "primary" ? "#fff" : "#000",
      }}
    >
      {label}
    </button>
  );
}
