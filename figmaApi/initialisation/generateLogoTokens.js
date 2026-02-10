const fs = require("fs");
require("dotenv").config();

async function fetchPngUrl(nodeId) {
  const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));
  const fileId = process.env.FILE_ID;

  const meta = await fetch(
    `https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=png&scale=2`,
    { headers: { "X-Figma-Token": process.env.FIGMA_TOKEN } }
  );
  if (!meta.ok) throw new Error(`Image API error: ${meta.status}`);

  const json = await meta.json();
  return json?.images?.[nodeId] || null;
}

async function generateLogoTokens(variants) {
  for (const v of variants) {
    const pngUrl = await fetchPngUrl(v.nodeId);
    const tokens = { uogLogo: { pngUrl, nodeId: v.nodeId } };
    const out = `./figmafiles/${v.fileName}.json`;
    fs.writeFileSync(out, JSON.stringify(tokens, null, 2));
    console.log(`Tokens written to ${out}`);
  }
}

module.exports = generateLogoTokens;