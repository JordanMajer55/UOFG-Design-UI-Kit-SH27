import phaseBannerJson from "../../../../../figmafiles/PhaseBanner-Beta.json";

export function PhaseBanner() {
  const phase = phaseBannerJson.phaseBanner?.beta;

  if (!phase) {
    return <div>Phase banner missing</div>;
  }

  const containerPadding = `${phase.container.padding.top}px ${phase.container.padding.right}px ${phase.container.padding.bottom}px ${phase.container.padding.left}px`;

  const tagPadding = `${phase.tag.padding.top}px ${phase.tag.padding.right}px ${phase.tag.padding.bottom}px ${phase.tag.padding.left}px`;

  return (
    <div
      style={{
        backgroundColor: phase.container.backgroundColor,
        padding: containerPadding,
        width: phase.container.width,
        height: phase.container.height,
        display: "flex",
        alignItems: "center",
        gap: phase.container.gap,
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          backgroundColor: phase.tag.backgroundColor,
          color: phase.tag.textColor,
          padding: tagPadding,
          fontFamily: phase.tag.typography.fontFamily,
          fontWeight: phase.tag.typography.fontWeight,
          fontSize: `${phase.tag.typography.fontSize}px`,
          lineHeight: `${phase.tag.typography.lineHeight}px`,
          letterSpacing: `${phase.tag.typography.letterSpacing}px`,
          whiteSpace: "nowrap",
        }}
      >
        {phase.tag.text}
      </span>

      <span
        style={{
          color: phase.message.color,
          fontFamily: phase.message.typography.fontFamily,
          fontWeight: phase.message.typography.fontWeight,
          fontSize: `${phase.message.typography.fontSize}px`,
          lineHeight: `${phase.message.typography.lineHeight}px`,
          letterSpacing: `${phase.message.typography.letterSpacing}px`,
        }}
      >
        {phase.message.text}
      </span>
    </div>
  );
}