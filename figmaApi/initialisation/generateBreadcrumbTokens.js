const fs = require("fs");
const fetchNode = require("./figmaGetNode.js");

function rgbaToCss(color) {
  const r = Math.round((color?.r ?? 0) * 255);
  const g = Math.round((color?.g ?? 0) * 255);
  const b = Math.round((color?.b ?? 0) * 255);
  const a = color?.a ?? 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function collectTextNodes(node, acc = []) {
  if (!node) return acc;
  if (node.type === "TEXT") acc.push(node);
  const children = node.children || [];
  for (const child of children) collectTextNodes(child, acc);
  return acc;
}

function extractTypography(textNode) {
  if (!textNode?.style) return null;
  return {
    fontFamily: textNode.style.fontFamily ?? null,
    fontWeight: textNode.style.fontWeight ?? null,
    fontSize: textNode.style.fontSize ?? null,
    lineHeightPx: textNode.style.lineHeightPx ?? null,
    letterSpacing: textNode.style.letterSpacing ?? null,
  };
}

function sizeFrom(node) {
  const bb = node?.absoluteBoundingBox;
  return bb ? { width: bb.width ?? null, height: bb.height ?? null } : null;
}

function extractBreadcrumbTokens(component) {
  const texts = collectTextNodes(component)
    .filter((n) => n.characters && n.absoluteBoundingBox);

  if (!texts.length) {
    return {
      items: null,
      typography: null,
      itemSpacing: component?.itemSpacing ?? null,
      paddingTop: component?.paddingTop ?? null,
      paddingRight: component?.paddingRight ?? null,
      paddingBottom: component?.paddingBottom ?? null,
      paddingLeft: component?.paddingLeft ?? null,
      size: sizeFrom(component),
    };
  }

  texts.sort((a, b) => a.absoluteBoundingBox.y - b.absoluteBoundingBox.y);
  const baseY = texts[0].absoluteBoundingBox.y;

  const row = texts
    .filter((n) => Math.abs(n.absoluteBoundingBox.y - baseY) < 6)
    .sort((a, b) => a.absoluteBoundingBox.x - b.absoluteBoundingBox.x);

  const first = row[0] || texts[0];

  return {
    items: row.length ? row.map((n) => n.characters ?? null).filter(Boolean) : null,
    typography: first ? extractTypography(first) : null,
    itemSpacing: component?.itemSpacing ?? null,
    paddingTop: component?.paddingTop ?? null,
    paddingRight: component?.paddingRight ?? null,
    paddingBottom: component?.paddingBottom ?? null,
    paddingLeft: component?.paddingLeft ?? null,
    size: sizeFrom(component),
  };
}

async function generateBreadcrumbTokens(variants) {
  for (const variant of variants) {
    const node = await fetchNode(variant.nodeId);
    const component = node?.nodes?.[variant.nodeId]?.document;

    if (!component) {
      throw new Error(`No document found for nodeId=${variant.nodeId}`);
    }

    const tokens = {
      breadcrumb: extractBreadcrumbTokens(component),
    };

    const outputPath = `./figmafiles/${variant.fileName}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
    console.log(`Tokens written to ${outputPath}`);
  }
}

module.exports = generateBreadcrumbTokens;
