jest.mock("node:fs", () => ({
  readFileSync: jest.fn(),
}));

jest.mock("../../../figmaApi/initialisation/findNode.js", () => jest.fn());

const { readFileSync } = require("node:fs");
const findNodeById = require("../../../figmaApi/initialisation/findNode.js");
const fetchNode = require("../../../figmaApi/initialisation/figmaGetNode.js");

describe("fetchNode", () => {
  const mockDocument = { id: "root", children: [] };
  const mockComponent = { id: "btn-1", name: "Button" };

  beforeEach(() => {
    readFileSync.mockReturnValue(JSON.stringify({ document: mockDocument }));
    findNodeById.mockReturnValue(mockComponent);
  });

  it("returns the correct node structure", async () => {
    const result = await fetchNode("btn-1");
    expect(result).toEqual({
      nodes: {
        "btn-1": { document: mockComponent },
      },
    });
  });

  it("calls findNodeById with the parsed document and the given nodeId", async () => {
    await fetchNode("btn-1");
    expect(findNodeById).toHaveBeenCalledWith(mockDocument, "btn-1");
  });

  it("returns null document when the node is not found", async () => {
    findNodeById.mockReturnValue(null);
    const result = await fetchNode("missing-id");
    expect(result).toEqual({
      nodes: {
        "missing-id": { document: null },
      },
    });
  });

  it("uses the nodeId as the key in the returned nodes object", async () => {
    const result = await fetchNode("my-node-id");
    expect(result.nodes).toHaveProperty("my-node-id");
  });

  it("throws when readFileSync fails (e.g. file not found)", async () => {
    readFileSync.mockImplementation(() => {
      throw new Error("ENOENT: no such file or directory");
    });
    await expect(fetchNode("btn-1")).rejects.toThrow("ENOENT");
  });

  it("throws when the file contains invalid JSON", async () => {
    readFileSync.mockReturnValue("not valid json {{");
    await expect(fetchNode("btn-1")).rejects.toThrow();
  });
});
