const fs = require("fs");
const fetchNode = require("../figmaGetNode.js");
const generatePhaseBannerTokens = require("../generatePhaseBannerTokens.js");

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("../figmaGetNode.js", () => jest.fn());

describe("generatePhaseBannerTokens", () => {
  const variant = { nodeId: "pb-1", fileName: "phase", name: "default" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a correctly structured phase banner token object", async () => {
    const component = {
      fills: [{ color: { r: 1, g: 1, b: 1, a: 1 } }],
      paddingTop: 8,
      paddingRight: 12,
      paddingBottom: 8,
      paddingLeft: 12,
      absoluteBoundingBox: { width: 360, height: 56 },
      itemSpacing: 8,
      children: [
        {
          type: "FRAME",
          name: "Label",
          fills: [{ color: { r: 0, g: 0, b: 1, a: 1 } }],
          paddingTop: 2,
          paddingRight: 6,
          paddingBottom: 2,
          paddingLeft: 6,
          children: [
            {
              id: "label-text",
              type: "TEXT",
              characters: "BETA",
              fills: [{ color: { r: 1, g: 1, b: 1, a: 1 } }],
              style: {
                fontFamily: "Arial",
                fontWeight: 700,
                fontSize: 12,
                lineHeightPx: 16,
                letterSpacing: 0,
              },
            },
          ],
        },
        {
          id: "msg-text",
          type: "TEXT",
          characters: "This is a beta service",
          fills: [{ color: { r: 0, g: 0, b: 0, a: 1 } }],
          style: {
            fontFamily: "Arial",
            fontWeight: 400,
            fontSize: 14,
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

    await generatePhaseBannerTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const tokens = written.phaseBanner[variant.name];

    expect(tokens.container).toMatchObject({
      backgroundColor: "rgba(255, 255, 255, 1)",
      padding: { top: 8, right: 12, bottom: 8, left: 12 },
      width: 360,
      height: 56,
      gap: 8,
    });

    expect(tokens.tag).toMatchObject({
      text: "BETA",
      backgroundColor: "rgba(0, 0, 255, 1)",
      textColor: "rgba(255, 255, 255, 1)",
      typography: {
        fontFamily: "Arial",
        fontWeight: 700,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0,
      },
      padding: { top: 2, right: 6, bottom: 2, left: 6 },
    });

    expect(tokens.message).toMatchObject({
      text: "This is a beta service",
      color: "rgba(0, 0, 0, 1)",
      typography: {
        fontFamily: "Arial",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
      },
    });

    Object.values(tokens).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });

  it("throws when node data is missing", async () => {
    fetchNode.mockResolvedValue({ nodes: {} });

    await expect(generatePhaseBannerTokens([variant])).rejects.toThrow(
      "No document found for nodeId=pb-1"
    );
  });

  it("handles empty component input with null values", async () => {
    fetchNode.mockResolvedValue({
      nodes: {
        [variant.nodeId]: { document: {} },
      },
    });

    await generatePhaseBannerTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const tokens = written.phaseBanner[variant.name];

    expect(tokens.container).toEqual({
      backgroundColor: null,
      padding: { top: null, right: null, bottom: null, left: null },
      width: null,
      height: null,
      gap: 0,
    });
    expect(tokens.tag).toBeNull();
    expect(tokens.message).toBeNull();

    Object.values(tokens.container).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });
});
