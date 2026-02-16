// Function that searches through the full file json recursively to find a path to a node id
function findNodeById(node, targetId, path = "document") {
  if (node.id === targetId) {
    return path;
  }

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const result = findNodeById(node.children[i], targetId, `${path}.children[${i}]`);

      if (result) {
        return result;
      }
    }
  }
  return null;
}

module.exports = findNodeById;
