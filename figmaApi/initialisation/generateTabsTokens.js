// Same logic as generateButtonTokens
const fs = require("fs");
const fetchNode = require("./figmaGetNode.js");



async function generateTabsTokens(variants) {
    for (const variant of variants) {
        const node = await fetchNode(variant.nodeId);
        const component = node?.nodes?.[variant.nodeId]?.document;

        if (!component) {
            throw new Error(`No document found for nodeId=${variant.nodeId}`);
        }

        const tokens = {
            tabs: {
                [variant.name]: extractSearchBoxTokens(component),
            },
        };

        const outputPath = `./figmafiles/${variant.fileName}.json`;
        fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
        console.log(`Tokens written to ${outputPath}`);
    }
}