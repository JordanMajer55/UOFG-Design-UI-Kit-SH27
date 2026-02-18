const fs = require("fs");
const fetchNode = require("./figmaGetNode.js");

function rgbaToCss(color) {
  const r = Math.round((color?.r ?? 0) * 255);
  const g = Math.round((color?.g ?? 0) * 255);
  const b = Math.round((color?.b ?? 0) * 255);
  const a = color?.a ?? 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function findFirst(node, predicate) {
  if (!node) return null;
  if (predicate(node)) return node;
  const children = node.children || [];
  for (const child of children) {
    const found = findFirst(child, predicate);
    if (found) return found;
  }
  return null;
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


function extractHeaderTokens(component) {
  const texts = collectTextNodes(component)
    .filter((n) => n.characters && n.absoluteBoundingBox);

  let firstText = null;
  let row = [];

  if (texts.length) {
    texts.sort((a, b) => a.absoluteBoundingBox.y - b.absoluteBoundingBox.y);
    const baseY = texts[0].absoluteBoundingBox.y;

    row = texts
      .filter((n) => Math.abs(n.absoluteBoundingBox.y - baseY) < 6)
      .sort((a, b) => a.absoluteBoundingBox.x - b.absoluteBoundingBox.x);

    firstText = row[0] || texts[0] || null;
  } else {
    firstText = findFirst(component, (n) => n.type === "TEXT");
  }

  const fillColor = firstText?.fills?.[0]?.color;

  const out = {
    text: firstText?.characters ?? null,
    typography: firstText ? extractTypography(firstText) : null,
    color: fillColor ? rgbaToCss(fillColor) : null,
    size: sizeFrom(component),
  };

  if (row.length > 1) {
    out.items = row.map((n) => n.characters ?? null).filter(Boolean);
  }

  return out;
}

async function generateHeaderTokens(variants) {
  for (const variant of variants) {
    const node = await fetchNode(variant.nodeId);
    const component = node?.nodes?.[variant.nodeId]?.document;

    if (!component) {
      throw new Error(`No document found for nodeId=${variant.nodeId}`);
    }

    const tokens = {
      header: extractHeaderTokens(component),
    };

    const outputPath = `./../figmafiles/${variant.fileName}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
    console.log(`Tokens written to ${outputPath}`);
  }
}

module.exports = generateHeaderTokens;
