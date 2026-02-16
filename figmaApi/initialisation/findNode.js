// Function that searches through the full file json recursively to find a path to a node id
function findNodeById(node, targetId) {
  if (node.id === targetId) {
    return node;
  }

  if (node.children) {
    for (const child of node.children) {
      const result = findNodeById(child, targetId);

      if (result) {
        return result;
      }
    }
  }
  return null;
}

module.exports = findNodeById;
