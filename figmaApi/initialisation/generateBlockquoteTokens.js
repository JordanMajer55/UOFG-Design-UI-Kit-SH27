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

function extractBlockquoteTokens(component) {
    // Container for Default blockquote is inside the component
    const container = findFirst(component, (n) => n.type === "FRAME" && n.name === "Frame 2") || component;


    // Quote icon (VECTOR)
    const icon = findFirst(container, (n) => n.type === "VECTOR") || null;

    // Main quote text
    const textNode = findFirst(container, (n) => n.type === "TEXT") || null;

    const containerFill = container?.fills?.[0]?.color ?? null;
    const iconColor = icon?.fills?.[0]?.color ?? icon?.strokes?.[0]?.color ?? null;
    const textColor = textNode?.fills?.[0]?.color ?? null;

    return {
        container: {
            backgroundColor: containerFill ? rgbaToCss(containerFill) : null,
            padding: {
                top: container?.paddingTop ?? null,
                right: container?.paddingRight ?? null,
                bottom: container?.paddingBottom ?? null,
                left: container?.paddingLeft ?? null,
            },
            gap: container?.itemSpacing ?? null, // auto-layout spacing if present
            width: container?.absoluteBoundingBox?.width ?? null,
            height: container?.absoluteBoundingBox?.height ?? null,
        },

        icon: icon
            ? {
                color: iconColor ? rgbaToCss(iconColor) : null,
                width: icon?.absoluteBoundingBox?.width ?? null,
                height: icon?.absoluteBoundingBox?.height ?? null,
            }
            : null,

        text: textNode
            ? {
                text: textNode.characters ?? null,
                color: textColor ? rgbaToCss(textColor) : null,
                typography: extractTypography(textNode),
            }
            : null,
    };
}

async function generateBlockquoteTokens(variants) {
    for (const variant of variants) {
        const node = await fetchNode(variant.nodeId);
        const entry = node?.nodes?.[variant.nodeId];

        if (!entry?.document) {
            console.warn(`Skipping ${variant.name}: nodeId ${variant.nodeId} not returned by Figma`);
            console.warn("Returned keys:", Object.keys(node?.nodes || {}));
            continue;
        }

        const component = entry.document;

        const tokens = {
            blockquote: {
                [variant.name]: extractBlockquoteTokens(component),
            },
        };

        const outputPath = `./../figmafiles/${variant.fileName}.json`;
        fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
        console.log(`Tokens written to ${outputPath}`);
    }
}

module.exports = generateBlockquoteTokens;
