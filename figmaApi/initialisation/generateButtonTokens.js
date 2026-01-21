//generates a BUtton.json file with specific id's properties
const fs = require("fs");
const fetchNode = require("./figmaGetNode.js")

function rgbaToCss(color) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function extractButtonTokens(component) {
  const textNode = component.children.find(
    (child) => child.type === "TEXT"
  );

  const bgFill = component.fills?.[0]?.color;

  return {
    backgroundColor: bgFill ? rgbaToCss(bgFill) : null,
    borderRadius: component.cornerRadius,
    width: component.absoluteBoundingBox.width,
    height: component.absoluteBoundingBox.height,
    padding: {
      top: component.paddingTop,
      right: component.paddingRight,
      bottom: component.paddingBottom,
      left: component.paddingLeft,
    },
    typography: textNode
      ? {
          fontFamily: textNode.style.fontFamily,
          fontWeight: textNode.style.fontWeight,
          fontSize: textNode.style.fontSize,
          lineHeight: textNode.style.lineHeightPx,
          letterSpacing: textNode.style.letterSpacing,
        }
      : null,
  };
}

async function generateButtonTokens(variants) {
  for (const variant of variants) {
    const node = await fetchNode(variant.nodeId);
    const component = node.nodes[variant.nodeId].document;

    const tokens = {
      button: {
        [variant.name]: extractButtonTokens(component),
      },
    };

    const outputPath = `./figmafiles/${variant.fileName}.json`;

    fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
    console.log(` Tokens written to ${outputPath}`);
  }
}

module.exports = generateButtonTokens;
