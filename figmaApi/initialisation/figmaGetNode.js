//file that fetches node from figma, then exports it to a "generate*Token" file
require("dotenv").config();

const FILE_ID = "ZOFT3XTYEsdMVK3zkQ0PI9";

async function fetchNode(nodeId) {
  const url =
    `https://api.figma.com/v1/files/${FILE_ID}/nodes?ids=${nodeId}`;

  const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

  const res = await fetch(url, {
    headers: { "X-Figma-Token": process.env.FIGMA_TOKEN }
  });

  const json = await res.json();
  return json;
}

module.exports = fetchNode;