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


async function generateTabsTokens(variants) {
    for (const variant of variants) {
        const node = await fetchNode(variant.nodeId);
        const component = node?.nodes?.[variant.nodeId]?.document;

        if (!component) {
            throw new Error(`No document found for nodeId=${variant.nodeId}`);
        }

        const tokens = {
            tabs: {
                [variant.name]: component,
            },
        };

        const outputPath = `./../figmafiles/${variant.fileName}.json`;
        fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
        console.log(`Tokens written to ${outputPath}`);
    }
}

module.exports = generateTabsTokens;