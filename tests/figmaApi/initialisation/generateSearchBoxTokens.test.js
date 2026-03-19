const fs = require("fs");
const fetchNode = require("../../../figmaApi/initialisation/figmaGetNode.js");
const generateSearchBoxTokens = require("../../../figmaApi/initialisation/generateSearchBoxTokens.js");

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("../../../figmaApi/initialisation/figmaGetNode.js", () => jest.fn());

describe("generateSearchBoxTokens", () => {
  const variant = { nodeId: "sb-1", fileName: "searchbox", name: "default" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a correctly structured search box token object", async () => {
    const component = {
      children: [
        {
          type: "RECTANGLE",
          name: "Input",
          fills: [{ color: { r: 1, g: 1, b: 1, a: 1 } }],
          strokes: [{ color: { r: 0, g: 0, b: 0, a: 1 } }],
          strokeWeight: 1,
          absoluteBoundingBox: { width: 220, height: 40 },
        },
        {
          type: "INSTANCE",
          name: "Button",
          fills: [{ color: { r: 0, g: 0, b: 1, a: 1 } }],
          cornerRadius: 4,
          paddingTop: 8,
          paddingRight: 12,
          paddingBottom: 8,
          paddingLeft: 12,
          absoluteBoundingBox: { width: 80, height: 40 },
          children: [
            {
              type: "TEXT",
              characters: "Search",
              fills: [{ color: { r: 1, g: 1, b: 1, a: 1 } }],
              style: {
                fontFamily: "Arial",
                fontWeight: 600,
                fontSize: 14,
                lineHeightPx: 20,
                letterSpacing: 0,
              },
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

    await generateSearchBoxTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const tokens = written.searchBox[variant.name];

    expect(tokens.input).toMatchObject({
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderColor: "rgba(0, 0, 0, 1)",
      borderWidth: 1,
      width: 220,
      height: 40,
    });

    expect(tokens.button).toMatchObject({
      backgroundColor: "rgba(0, 0, 255, 1)",
      borderRadius: 4,
      padding: { top: 8, right: 12, bottom: 8, left: 12 },
      width: 80,
      height: 40,
      typography: {
        fontFamily: "Arial",
        fontWeight: 600,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
      },
      textColor: "rgba(255, 255, 255, 1)",
      text: "Search",
    });

    Object.values(tokens).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });

  it("throws when node data is missing", async () => {
    fetchNode.mockResolvedValue({ nodes: {} });

    await expect(generateSearchBoxTokens([variant])).rejects.toThrow(
      "No document found for nodeId=sb-1"
    );
  });

  it("handles empty component input with null values", async () => {
    fetchNode.mockResolvedValue({
      nodes: {
        [variant.nodeId]: { document: {} },
      },
    });

    await generateSearchBoxTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const tokens = written.searchBox[variant.name];

    expect(tokens.input).toEqual({
      backgroundColor: null,
      borderColor: null,
      borderWidth: null,
      width: null,
      height: null,
    });

    expect(tokens.button).toEqual({
      backgroundColor: null,
      borderRadius: null,
      padding: { top: null, right: null, bottom: null, left: null },
      width: null,
      height: null,
      typography: null,
      textColor: null,
      text: null,
    });

    Object.values(tokens.input).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });
});
