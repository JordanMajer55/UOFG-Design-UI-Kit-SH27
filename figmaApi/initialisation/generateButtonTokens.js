const fs = require("fs");
const fetchNode = require("./figmaGetNode.js")

function rgbaToCss(color) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

async function generateToken(comp_id) {
  const node = await fetchNode(comp_id);

  const component = node.nodes[comp_id].document;
  const textNode = component.children[0];
  const bg = component.fills[0].color;

  const tokens = {
    button: {
      primary: {
        backgroundColor: rgbaToCss(bg),
        borderRadius: component.cornerRadius,
        padding: {
          top: component.paddingTop,
          right: component.paddingRight,
          bottom: component.paddingBottom,
          left: component.paddingLeft,
        },
        typography: {
          fontFamily: textNode.style.fontFamily,
          fontWeight: textNode.style.fontWeight,
          fontSize: textNode.style.fontSize,
          lineHeight: textNode.style.lineHeightPx,
          letterSpacing: textNode.style.letterSpacing,
        }
      }
    }
  };

  fs.writeFileSync("buttonTokens.json", JSON.stringify(tokens, null, 2));
  console.log("Tokens written to buttonTokens.json");
}

generateToken("29:364");
