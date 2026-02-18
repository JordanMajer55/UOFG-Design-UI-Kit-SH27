const fs = require("fs");
const fetchNode = require("./figmaGetNode.js");

function rgbaToCss(color) {
  const r = Math.round((color?.r ?? 0) * 255);
  const g = Math.round((color?.g ?? 0) * 255);
  const b = Math.round((color?.b ?? 0) * 255);
  const a = color?.a ?? 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Find first matching node anywhere in the tree
function findFirst(node, predicate) {
  if (!node) return null;
  if (predicate(node)) return node;
  for (const child of node.children || []) {
    const found = findFirst(child, predicate);
    if (found) return found;
  }
  return null;
}

function extractTypography(textNode) {
  if (!textNode?.style) return null;
  return {
    fontFamily: textNode.style.fontFamily ?? null,
    fontWeight: textNode.style.fontWeight ?? null,
    fontSize: textNode.style.fontSize ?? null,
    lineHeight: textNode.style.lineHeightPx ?? null,
    letterSpacing: textNode.style.letterSpacing ?? null,
  };
}

function extractPhaseBannerTokens(component) {
  // Outer container style
  const containerFill = component?.fills?.[0]?.color ?? null;

  // Find the "Label" frame, then find its TEXT inside (Alpha/Beta)
  const labelFrame = findFirst(component, (n) => n.type === "FRAME" && n.name === "Label");
  const labelText = findFirst(labelFrame, (n) => n.type === "TEXT");

  // Message text = first TEXT that is NOT inside the Label frame
  const messageText = findFirst(component, (n) => {
    if (n.type !== "TEXT") return false;
    if (!labelText) return true;
    return n.id !== labelText.id;
  });

  // Label background color usually comes from the Label frame fills
  const labelBg = labelFrame?.fills?.[0]?.color ?? null;
  const labelTextColor = labelText?.fills?.[0]?.color ?? null;
  const messageColor = messageText?.fills?.[0]?.color ?? null;

  return {
    container: {
      backgroundColor: containerFill ? rgbaToCss(containerFill) : null,
      padding: {
        top: component?.paddingTop ?? null,
        right: component?.paddingRight ?? null,
        bottom: component?.paddingBottom ?? null,
        left: component?.paddingLeft ?? null,
      },
      width: component?.absoluteBoundingBox?.width ?? null,
      height: component?.absoluteBoundingBox?.height ?? null,
      gap: component.itemSpacing ?? 0,
    },
    tag: labelText
      ? {
          text: labelText.characters ?? null,
          backgroundColor: labelBg ? rgbaToCss(labelBg) : null,
          textColor: labelTextColor ? rgbaToCss(labelTextColor) : null,
          typography: extractTypography(labelText),
          padding: {
            top: labelFrame?.paddingTop ?? null,
            right: labelFrame?.paddingRight ?? null,
            bottom: labelFrame?.paddingBottom ?? null,
            left: labelFrame?.paddingLeft ?? null,
          },
        }
      : null,
    message: messageText
      ? {
          text: messageText.characters ?? null,
          color: messageColor ? rgbaToCss(messageColor) : null,
          typography: extractTypography(messageText),
        }
      : null,
  };
}

async function generatePhaseBannerTokens(variants) {
  for (const variant of variants) {
    const node = await fetchNode(variant.nodeId);
    const component = node?.nodes?.[variant.nodeId]?.document;

    if (!component) throw new Error(`No document found for nodeId=${variant.nodeId}`);

    const tokens = {
      phaseBanner: {
        [variant.name]: extractPhaseBannerTokens(component),
      },
    };

    const outputPath = `./../figmafiles/${variant.fileName}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
    console.log(`Tokens written to ${outputPath}`);
  }
}

module.exports = generatePhaseBannerTokens;
