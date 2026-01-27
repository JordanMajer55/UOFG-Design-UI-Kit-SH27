"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  styleButtonByClass: () => styleButtonByClass
});
module.exports = __toCommonJS(index_exports);

// src/components/buttons.ts
async function styleButtonByClass(name, type) {
  try {
    const response = await fetch(`http://localhost:3000/button-${type}`);
    if (!response.ok) {
      console.error("Failed to fetch button json");
      return;
    }
    const fullData = await response.json();
    const data = fullData.button[type];
    const btns = document.getElementsByClassName(`${name}`);
    Array.from(btns).forEach((btn) => {
      Object.assign(btn.style, {
        backgroundColor: data.backgroundColor,
        borderRadius: `${data.borderRadius}px`,
        width: `${data.width}px`,
        height: `${data.height}px`,
        padding: `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`,
        fontFamily: `"${data.typography.fontFamily}"`,
        fontWeight: data.typography.fontWeight,
        fontSize: `${data.typography.fontSize}px`,
        lineHeight: `${data.typography.lineHeight}px`,
        letterSpacing: `${data.typography.letterSpacing}px`,
        border: "none"
      });
    });
  } catch (err) {
    console.error(err);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  styleButtonByClass
});
