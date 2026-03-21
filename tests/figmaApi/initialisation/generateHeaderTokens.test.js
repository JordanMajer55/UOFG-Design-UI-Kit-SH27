const fs = require("fs");
const fetchNode = require("../../../figmaApi/initialisation/figmaGetNode.js");
const generateHeaderTokens = require("../../../figmaApi/initialisation/generateHeaderTokens.js");

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("../../../figmaApi/initialisation/figmaGetNode.js", () => jest.fn());

describe("generateHeaderTokens", () => {
  const variant = { nodeId: "node-1", fileName: "header", name: "Header" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a correctly structured header token object", async () => {
    const component = {
      absoluteBoundingBox: { width: 200, height: 80 },
      children: [
        {
          type: "TEXT",
          characters: "Home",
          absoluteBoundingBox: { x: 0, y: 10, width: 40, height: 20 },
          fills: [{ color: { r: 1, g: 0, b: 0, a: 1 } }],
          style: {
            fontFamily: "Arial",
            fontWeight: 700,
            fontSize: 18,
            lineHeightPx: 22,
            letterSpacing: 0,
          },
        },
        {
          type: "TEXT",
          characters: "About",
          absoluteBoundingBox: { x: 60, y: 12, width: 50, height: 20 },
          fills: [{ color: { r: 0, g: 1, b: 0, a: 1 } }],
          style: {
            fontFamily: "Arial",
            fontWeight: 400,
            fontSize: 16,
            lineHeightPx: 20,
            letterSpacing: 0,
          },
        },
      ],
    };

    fetchNode.mockResolvedValue({
      nodes: {
        [variant.nodeId]: { document: component },
      },
    });

    await generateHeaderTokens([variant]);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);

    expect(written).toHaveProperty("header");
    expect(written.header).toHaveProperty("text", "Home");
    expect(written.header).toHaveProperty("items");
    expect(written.header.items).toEqual(["Home", "About"]);

    expect(written.header).toHaveProperty("typography");
    expect(written.header.typography).toMatchObject({
      fontFamily: "Arial",
      fontWeight: 700,
      fontSize: 18,
      lineHeightPx: 22,
      letterSpacing: 0,
    });

    expect(written.header).toHaveProperty("color", "rgba(255, 0, 0, 1)");
    expect(written.header).toHaveProperty("size");
    expect(written.header.size).toMatchObject({ width: 200, height: 80 });

    Object.values(written.header).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });

  it("throws when node data is missing", async () => {
    fetchNode.mockResolvedValue({ nodes: {} });

    await expect(generateHeaderTokens([variant])).rejects.toThrow(
      "No document found for nodeId=node-1"
    );
  });

  it("handles empty component input with null values", async () => {
    fetchNode.mockResolvedValue({
      nodes: {
        [variant.nodeId]: { document: {} },
      },
    });

    await generateHeaderTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written.header).toEqual({
      text: null,
      typography: null,
      color: null,
      size: null,
    });

    Object.values(written.header).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });
});
