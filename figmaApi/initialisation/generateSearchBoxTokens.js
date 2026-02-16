// Same logic as generateButtonTokens
const fs = require("fs");
const fetchNode = require("./figmaGetNode.js");

function rgbaToCss(color) {
    const r = Math.round((color?.r ?? 0) * 255);
    const g = Math.round((color?.g ?? 0) * 255);
    const b = Math.round((color?.b ?? 0) * 255);
    const a = color?.a ?? 1;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Recursively searches through a Figma node tree and returns
// the first node that matches the condition (for nested components)
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

// Extracts font-related properties from a TEXT node
// and formats them into a clean token object
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

function extractSearchBoxTokens(component) {
    const input = findFirst(component, (n) => n.type === "RECTANGLE" && n.name === "Input");
    const button = findFirst(component, (n) => n.type === "INSTANCE" && n.name === "Button");
    const buttonText = button ? findFirst(button, (n) => n.type === "TEXT") : null;
    const inputFill = input?.fills?.[0]?.color;
    const inputStroke = input?.strokes?.[0]?.color;
    const buttonFill = button?.fills?.[0]?.color;

    return {
        input: {
            backgroundColor: inputFill ? rgbaToCss(inputFill) : null,
            borderColor: inputStroke ? rgbaToCss(inputStroke) : null,
            borderWidth: input?.strokeWeight ?? null,
            width: input?.absoluteBoundingBox?.width ?? null,
            height: input?.absoluteBoundingBox?.height ?? null,
        },
        button: {
            backgroundColor: buttonFill ? rgbaToCss(buttonFill) : null,
            borderRadius: button?.cornerRadius ?? null,
            padding: {
                top: button?.paddingTop ?? null,
                right: button?.paddingRight ?? null,
                bottom: button?.paddingBottom ?? null,
                left: button?.paddingLeft ?? null,
            },
            width: button?.absoluteBoundingBox?.width ?? null,
            height: button?.absoluteBoundingBox?.height ?? null,
            typography: buttonText ? extractTypography(buttonText) : null,
            textColor: buttonText?.fills?.[0]?.color
                ? rgbaToCss(buttonText.fills[0].color)
                : null,
            text: buttonText?.characters ?? null,
        },
    };
};

async function generateSearchBoxTokens(variants) {
    for (const variant of variants) {
        const node = await fetchNode(variant.nodeId);
        const component = node?.nodes?.[variant.nodeId]?.document;

        if (!component) {
            throw new Error(`No document found for nodeId=${variant.nodeId}`);
        }

        const tokens = {
            searchBox: {
                [variant.name]: extractSearchBoxTokens(component),
            },
        };

        const outputPath = `./../figmafiles/${variant.fileName}.json`;
        fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
        console.log(`Tokens written to ${outputPath}`);
    }
}

module.exports = generateSearchBoxTokens;
