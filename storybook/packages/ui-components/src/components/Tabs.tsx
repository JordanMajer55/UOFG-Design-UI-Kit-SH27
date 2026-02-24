import tabsJson from "../../../../../figmafiles/Tabs-Default.json";

function rgba(colour: { r: number; g: number; b: number; a: number }) {
  return `rgba(${Math.round(colour.r * 255)}, ${Math.round(
    colour.g * 255
  )}, ${Math.round(colour.b * 255)}, ${colour.a})`;
}

export function Tabs() {
  const tabs = tabsJson.default;

  if (!tabs) {
    return <div>Tabs data missing</div>;
  }

  const tabLabels = ["Tab 1", "Tab 2", "Tab 3"]; // display tabs
  const activeIndex = 0;

  return (
    <div
      style={{
        display: "flex",
        gap: tabs.container.itemSpacing,
        height: tabs.tabs.height,
        borderBottom: `${tabs.tabs.BottomBorderWeight}px solid ${rgba(
          tabs.tabs.bottomBorderColour
        )}`,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {tabLabels.map((label, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={index}
            style={{
              paddingTop: tabs.defaultButton.paddingTop,
              paddingBottom: tabs.defaultButton.paddingBottom,
              width: tabs.defaultButton.width,
              height: tabs.defaultButton.height,
              border: "none",
              background: "transparent",
              cursor: "pointer",

              fontFamily: tabs.defaultButton.textStyle.fontFamily,
              fontWeight: isActive
                ? tabs.activeButton.textStyle.fontweight
                : tabs.defaultButton.textStyle.fontWeight,

              fontSize: tabs.defaultButton.textStyle.fontSize,

              lineHeight: `${tabs.defaultButton.textStyle.lineHeight}px`,

              color: isActive
                ? rgba(tabs.activeButton.textStyle.textColour)
                : rgba(tabs.defaultButton.textStyle.textColour),

              borderBottom: isActive
                ? `${tabs.activeButton.strokeWeightBottom}px solid ${rgba(
                    tabs.activeButton.textStyle.textColour
                  )}`
                : "none",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}