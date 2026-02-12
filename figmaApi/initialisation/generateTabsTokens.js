// Same logic as generateButtonTokens
const fs = require("fs");
const fetchNode = require("./figmaGetNode.js");
const findNodeById = require("./findNode.js");

function rgbaToCss(color) {
    const r = Math.round((color?.r ?? 0) * 255);
    const g = Math.round((color?.g ?? 0) * 255);
    const b = Math.round((color?.b ?? 0) * 255);
    const a = color?.a ?? 1;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function extractTabsToken(component) {
    
}

async function generateTabsTokens(variants) {
    for (const variant of variants) {
        var file = require("./fullFile.json");
        const component = file.document.children[variant.position].children[variant.canvas].children[variant.frame];

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