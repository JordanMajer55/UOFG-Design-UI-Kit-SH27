import { useEffect, useState } from "react";
import breadcrumbJson from "../../../../../figmafiles/Breadcrumb.json";

interface Typography {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeightPx: number;
  letterSpacing: number;
}

interface Size {
  width: number;
  height: number;
}

interface BreadcrumbStyle {
  items: string[];
  typography: Typography;
  itemSpacing: number;
  paddingTop: number | null;
  paddingRight: number | null;
  paddingBottom: number | null;
  paddingLeft: number | null;
  size: Size;
}

export function Breadcrumb() {
  const [style, setStyle] = useState<BreadcrumbStyle | null>(null);

  useEffect(() => {
    const currentStyle = breadcrumbJson.breadcrumb;
    setStyle(currentStyle || null);
  }, []);

  if (!style) return <div>Loading...</div>;

  const padding = `
    ${style.paddingTop ?? 0}px 
    ${style.paddingRight ?? 0}px 
    ${style.paddingBottom ?? 0}px 
    ${style.paddingLeft ?? 0}px
  `;

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${style.itemSpacing}px`,
        fontFamily: style.typography.fontFamily,
        fontWeight: style.typography.fontWeight,
        fontSize: `${style.typography.fontSize}px`,
        lineHeight: `${style.typography.lineHeightPx}px`,
        letterSpacing: `${style.typography.letterSpacing}px`,
        color: style.typography.color,
      }}
    >
     {style.items.map((item, index) => (
  <span key={index} style={{ color: style.typography.color }}>
    {item}
    {index < style.items.length - 1 && (
      <span style={{ color: style.typography.separatorColor }}>{" > "}</span>
    )}
  </span>
))}
    </nav>
  );
}
