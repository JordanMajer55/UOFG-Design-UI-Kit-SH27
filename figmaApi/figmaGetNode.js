require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");

async function fetchNode(nodeId) {
  const url =
    `https://api.figma.com/v1/files/${process.env.FILE_ID}/nodes?ids=${nodeId}`;

  const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

const res = await fetch(url, {

    headers: { "X-Figma-Token": process.env.FIGMA_TOKEN }
  });

  const json = await res.json();
  fs.writeFileSync("buttonNode.json", JSON.stringify(json, null, 2));

  console.log("Saved:", "buttonNode.json");
}

fetchNode("29:364");