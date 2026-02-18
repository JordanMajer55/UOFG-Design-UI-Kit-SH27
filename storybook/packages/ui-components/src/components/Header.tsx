import headerJson from "../../../../../figmafiles/Header.json";

export function Header() {
  const header = headerJson.header;

  if (!header) return <div>Header data missing</div>;

  return (
    <nav
      style={{
        width: "100%",
        display: "flex",
        gap: "16px",
        alignItems: "center",
        padding: "8px",
        overflowX: "auto",
      }}
    >
      {header.items.map((item, index) => (
        <span
          key={index}
          style={{
            color: header.color,
            fontFamily: header.typography.fontFamily,
            fontWeight: header.typography.fontWeight,
            fontSize: `${header.typography.fontSize}px`,
            lineHeight: `${header.typography.lineHeightPx}px`,
            letterSpacing: `${header.typography.letterSpacing}px`,
            whiteSpace: "nowrap",
          }}
        >
          {item}
        </span>
      ))}
    </nav>
  );
}