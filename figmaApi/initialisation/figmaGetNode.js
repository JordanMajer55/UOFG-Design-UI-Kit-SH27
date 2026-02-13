//file that fetches node from figma, then exports it to a "generate*Token" file
const { readFileSync } = require("node:fs");
require("dotenv").config();


const FILE_ID = "ZOFT3XTYEsdMVK3zkQ0PI9";// this needs to be moved to an env


function findNodeById(node, targetId){
  if (node.id == targetId) return node;
  if (node.children){
    for(const child of node.children){
      const found = findNodeById(child, targetId);
      if(found) return found;
    }
  }
  return null;
}


async function fetchNode(nodeId) {
  const fileData = JSON.parse(readFileSync("./fullFile.json"))
  const node = findNodeById(fileData.document, nodeId)

  const json = { nodes: { [nodeId]: {document:node} } };
  console.log(json);
  return json;
}
fetchNode("29:364")
module.exports = fetchNode;