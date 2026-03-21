const fs = require("fs");
const fetchNode = require("../../../figmaApi/initialisation/figmaGetNode.js");
const generateTabsTokens = require("../../../figmaApi/initialisation/generateTabsTokens.js");

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("../../../figmaApi/initialisation/figmaGetNode.js", () => jest.fn());

describe("generateTabsTokens", () => {
  const variant = { nodeId: "tabs-1", fileName: "tabs", name: "default" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a correctly structured tabs token object", async () => {
    const component = {
      layoutMode: "HORIZONTAL",
      absoluteBoundingBox: { height: 40 },
      strokes: [{ color: { r: 0, g: 0, b: 0, a: 1 } }],
      individualStrokeWeights: { bottom: 2 },
      children: [
        {
          layoutMode: "HORIZONTAL",
          itemSpacing: 8,
          absoluteBoundingBox: { height: 36 },
          layoutWrap: "NO_WRAP",
          children: [
            {
              paddingTop: 6,
              paddingBottom: 6,
              absoluteBoundingBox: { width: 80, height: 32 },
              strokeWeight: 1,
              children: [
                {
                  style: {
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeightPx: 20,
                  },
                  fills: [{ color: { r: 0, g: 0, b: 0, a: 1 } }],
                },
              ],
            },
            {},
            {
              individualStrokeWeights: { bottom: 3 },
              color: { r: 1, g: 0, b: 0, a: 1 },
              children: [
                {
                  style: { fontWeight: 700 },
                  fills: [{ color: { r: 1, g: 0, b: 0, a: 1 } }],
                },
              ],
            },
          ],
        },
      ],
    };

    fetchNode.mockResolvedValue({
      nodes: {
        [variant.nodeId]: { document: component },
      },
    });

    await generateTabsTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const tokens = written[variant.name];

    expect(tokens).toHaveProperty("tabs");
    expect(tokens).toHaveProperty("container");
    expect(tokens).toHaveProperty("defaultButton");
    expect(tokens).toHaveProperty("activeButton");

    expect(tokens.tabs).toMatchObject({
      layout: "HORIZONTAL",
      height: 40,
      bottomBorderColour: { r: 0, g: 0, b: 0, a: 1 },
      BottomBorderWeight: 2,
    });

    expect(tokens.container).toMatchObject({
      layout: "HORIZONTAL",
      itemSpacing: 8,
      height: 36,
      layoutWrap: "NO_WRAP",
    });

    expect(tokens.defaultButton).toHaveProperty("paddingTop", 6);
    expect(tokens.defaultButton).toHaveProperty("paddingBottom", 6);
    expect(tokens.defaultButton).toHaveProperty("width", 80);
    expect(tokens.defaultButton).toHaveProperty("height", 32);
    expect(tokens.defaultButton).toHaveProperty("strokeWeight", 1);
    expect(tokens.defaultButton.textStyle).toMatchObject({
      fontFamily: "Inter",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 20,
      textColour: { r: 0, g: 0, b: 0, a: 1 },
    });

    expect(tokens.activeButton).toMatchObject({
      strokeWeightBottom: 3,
      strokeColour: { r: 1, g: 0, b: 0, a: 1 },
    });
    expect(tokens.activeButton.textStyle).toMatchObject({
      fontweight: 700,
      textColour: { r: 1, g: 0, b: 0, a: 1 },
    });

    Object.values(tokens).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });

  it("throws when node data is missing", async () => {
    fetchNode.mockResolvedValue({ nodes: {} });

    await expect(generateTabsTokens([variant])).rejects.toThrow(
      "No document found for nodeId=tabs-1"
    );
  });

  it("throws on empty component input", async () => {
    fetchNode.mockResolvedValue({
      nodes: {
        [variant.nodeId]: { document: {} },
      },
    });

    await expect(generateTabsTokens([variant])).rejects.toThrow();
  });
});
