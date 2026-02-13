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

async function generateTabsTokens(variants) {
    for (const variant of variants) {
        var file = require("./fullFile.json");
        const component = file.document.children[variant.position].children[variant.canvas].children[variant.frame];

        if (!component) {
            throw new Error(`No document found for nodeId=${variant.nodeId}`);
        }

        const tokens = {
            [variant.name]: {
                "tabs": {
                    "layout": component.layoutMode,
                    "height": component.absoluteBoundingBox.height,
                    "bottomBorderColour": component.strokes[0].color,
                    "BottomBorderWeight": component.individualStrokeWeights.bottom,
                },
                "container": {
                    "layout": component.children[0].layoutMode,
                    "itemSpacing": component.children[0].itemSpacing,
                    "height": component.children[0].absoluteBoundingBox.height,
                    "layoutWrap": component.children[0].layoutWrap,
                },
                "defaultButton": {
                    "paddingTop": component.children[0].children[0].paddingTop,
                    "paddingBottom": component.children[0].children[0].paddingBottom,
                    "width": component.children[0].children[0].absoluteBoundingBox.width,
                    "height": component.children[0].children[0].absoluteBoundingBox.height,
                    "strokeWeight": component.children[0].children[0].strokeWeight,
                    "textStyle": {
                        "fontFamily": component.children[0].children[0].children[0].style.fontFamily,
                        "fontWeight": component.children[0].children[0].children[0].style.fontWeight,
                        "fontSize": component.children[0].children[0].children[0].style.fontSize,
                        "lineHeight": component.children[0].children[0].children[0].style.lineHeightPx,
                        "textColour": component.children[0].children[0].children[0].fills[0].color,
                    }
                },
                "activeButton": {
                    "strokeWeightBottom": component.children[0].children[2].individualStrokeWeights.bottom,
                    "strokeColour": component.children[0].children[2].color,
                    "textStyle": {
                        "fontweight": component.children[0].children[2].children[0].style.fontWeight,
                        "textColour": component.children[0].children[2].children[0].fills[0].color,
                    }
                },
            },
        };

        const outputPath = `./../figmafiles/${variant.fileName}.json`;
        fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
        console.log(`Tokens written to ${outputPath}`);
    }
}

module.exports = generateTabsTokens;