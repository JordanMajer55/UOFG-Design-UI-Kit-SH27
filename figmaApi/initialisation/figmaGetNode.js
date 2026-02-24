//file that fetches node from figma, then exports it to a "generate*Token" file
const { readFileSync } = require("node:fs");
const findNodeById = require('./findNode');
require("dotenv").config();


const FILE_ID = "ZOFT3XTYEsdMVK3zkQ0PI9";// this needs to be moved to an env


async function fetchNode(nodeId) {
  const fileData = JSON.parse(readFileSync("./../figmaApi/initialisation/fullFile.json"))
  const component = findNodeById(fileData.document, nodeId)

  const json = { nodes: { [nodeId]: {document:component} } };

  return json;
}
module.exports = fetchNode;