const fs = require("fs");
const fetchNode = require("./figmaGetNode.js");

function rgbaToCss(color) {
  if (!color) return null;
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a ?? 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function findAll(node, predicate, out = []) {
  if (!node) return out;
  if (predicate(node)) out.push(node);
  for (const c of node.children || []) findAll(c, predicate, out);
  return out;
}

function findFirst(node, predicate) {
  return findAll(node, predicate, [])[0] || null;
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

function extractDownloadLinkTokens(component) {
  // ✅ container is the root component (State=Default)
  const container = component;

  const containerFill =
    container?.fills?.[0]?.color ??
    container?.background?.[0]?.color ??
    null;

  const titleNode =
    findFirst(component, (n) => n.type === "TEXT" && n.name === "Document title") ||
    findAll(component, (n) => n.type === "TEXT")[0] ||
    null;

  const metaNode =
    findFirst(component, (n) => n.type === "TEXT" && n.name.includes("PDF")) ||
    findAll(component, (n) => n.type === "TEXT")[1] ||
    null;

  const divider =
    findFirst(component, (n) => n.type === "LINE" && n.name === "Line 1") ||
    null;

  const icon = findFirst(component, (n) => n.type === "VECTOR") || null;

  // ✅ accent bar comes from container left stroke
  const leftStrokeWidth = container?.individualStrokeWeights?.left ?? null;
  const accentBar =
    leftStrokeWidth && leftStrokeWidth > 0
      ? {
          color: rgbaToCss(container?.strokes?.[0]?.color ?? null),
          width: leftStrokeWidth,
          height: container?.absoluteBoundingBox?.height ?? null,
        }
      : null;

  return {
    container: {
      backgroundColor: containerFill ? rgbaToCss(containerFill) : null,
      width: container?.absoluteBoundingBox?.width ?? null,
      height: container?.absoluteBoundingBox?.height ?? null,
      padding: {
        top: container?.paddingTop ?? null,
        right: container?.paddingRight ?? null,
        bottom: container?.paddingBottom ?? null,
        left: container?.paddingLeft ?? null,
      },
      gap: container?.itemSpacing ?? null,
    },

    accentBar,

    title: titleNode
      ? {
          text: titleNode.characters ?? null,
          color: rgbaToCss(titleNode?.fills?.[0]?.color),
          typography: extractTypography(titleNode),
        }
      : null,

    meta: metaNode
      ? {
          text: metaNode.characters ?? null,
          color: rgbaToCss(metaNode?.fills?.[0]?.color),
          typography: extractTypography(metaNode),
        }
      : null,

    divider: divider
      ? {
          color: rgbaToCss(divider?.strokes?.[0]?.color ?? divider?.fills?.[0]?.color),
          width: divider?.absoluteRenderBounds?.width ?? divider?.absoluteBoundingBox?.width ?? null,
          height: divider?.absoluteRenderBounds?.height ?? divider?.absoluteBoundingBox?.height ?? null,
        }
      : null,

    icon: icon
      ? {
          color: rgbaToCss(icon?.fills?.[0]?.color ?? icon?.strokes?.[0]?.color),
          width: icon?.absoluteBoundingBox?.width ?? null,
          height: icon?.absoluteBoundingBox?.height ?? null,
        }
      : null,
  };
}

async function generateDownloadLinkTokens(variants) {
  for (const variant of variants) {
    const node = await fetchNode(variant.nodeId);
    const entry = node?.nodes?.[variant.nodeId];

    if (!entry?.document) {
      console.warn(`Skipping ${variant.name}: nodeId ${variant.nodeId} not returned`);
      console.warn("Returned keys:", Object.keys(node?.nodes || {}));
      continue;
    }

    const component = entry.document;

    const tokens = {
      downloadLink: {
        [variant.name]: extractDownloadLinkTokens(component),
      },
    };

    const outputPath = `./figmafiles/${variant.fileName}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
    console.log(`Tokens written to ${outputPath}`);
  }
}

module.exports = generateDownloadLinkTokens;
