const findNodeById = require("../../../figmaApi/initialisation/findNode.js");

describe("findNodeById", () => {
  it("returns the node when the id matches at root level", () => {
    const node = { id: "root-1", name: "Root" };
    expect(findNodeById(node, "root-1")).toBe(node);
  });

  it("returns a direct child node by id", () => {
    const child = { id: "child-1", name: "Child" };
    const node = { id: "root", children: [child] };
    expect(findNodeById(node, "child-1")).toBe(child);
  });

  it("returns a deeply nested node by id", () => {
    const deepNode = { id: "deep", name: "Deep" };
    const node = {
      id: "root",
      children: [
        {
          id: "level-1",
          children: [
            { id: "level-2", children: [deepNode] },
          ],
        },
      ],
    };
    expect(findNodeById(node, "deep")).toBe(deepNode);
  });

  it("returns the first matching node when multiple children exist", () => {
    const target = { id: "target", name: "Target" };
    const other = { id: "other", name: "Other" };
    const node = { id: "root", children: [target, other] };
    expect(findNodeById(node, "target")).toBe(target);
  });

  it("returns null when the id is not found", () => {
    const node = { id: "root", children: [{ id: "child" }] };
    expect(findNodeById(node, "nonexistent")).toBeNull();
  });

  it("returns null when the node has no children", () => {
    const node = { id: "root" };
    expect(findNodeById(node, "other")).toBeNull();
  });

  it("returns null for an empty children array", () => {
    const node = { id: "root", children: [] };
    expect(findNodeById(node, "other")).toBeNull();
  });

  it("returns the correct node when target is the last sibling", () => {
    const last = { id: "last", name: "Last" };
    const node = { id: "root", children: [{ id: "first" }, { id: "middle" }, last] };
    expect(findNodeById(node, "last")).toBe(last);
  });

  it("returns the root node itself if it matches, before checking children", () => {
    const child = { id: "root", name: "Child with same id" };
    const node = { id: "root", name: "Root", children: [child] };
    expect(findNodeById(node, "root")).toBe(node);
  });

  it("returns null when searching a single leaf node that does not match", () => {
    const node = { id: "leaf" };
    expect(findNodeById(node, "other")).toBeNull();
  });
});
