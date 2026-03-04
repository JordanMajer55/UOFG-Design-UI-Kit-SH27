const fs = require("fs");
const fetchNode = require("../figmaGetNode.js");
const generateBlockquoteTokens = require("../generateBlockquoteTokens.js");

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("../figmaGetNode.js", () => jest.fn());

describe("generateBlockquoteTokens", () => {
  const variant = { nodeId: "bq-1", fileName: "blockquote", name: "default" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a correctly structured blockquote token object", async () => {
    const component = {
      type: "COMPONENT",
      children: [
        {
          type: "FRAME",
          name: "Frame 2",
          fills: [{ color: { r: 1, g: 1, b: 1, a: 1 } }],
          paddingTop: 12,
          paddingRight: 16,
          paddingBottom: 12,
          paddingLeft: 16,
          itemSpacing: 8,
          absoluteBoundingBox: { width: 300, height: 120 },
          children: [
            {
              type: "VECTOR",
              fills: [{ color: { r: 0, g: 0, b: 0, a: 1 } }],
              absoluteBoundingBox: { width: 24, height: 24 },
            },
            {
              type: "TEXT",
              characters: "Quote text",
              fills: [{ color: { r: 0, g: 0, b: 0, a: 1 } }],
              style: {
                fontFamily: "Georgia",
                fontWeight: 400,
                fontSize: 16,
                lineHeightPx: 24,
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

    await generateBlockquoteTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const tokens = written.blockquote[variant.name];

    expect(tokens.container).toMatchObject({
      backgroundColor: "rgba(255, 255, 255, 1)",
      padding: { top: 12, right: 16, bottom: 12, left: 16 },
      gap: 8,
      width: 300,
      height: 120,
    });

    expect(tokens.icon).toMatchObject({
      color: "rgba(0, 0, 0, 1)",
      width: 24,
      height: 24,
    });

    expect(tokens.text).toMatchObject({
      text: "Quote text",
      color: "rgba(0, 0, 0, 1)",
      typography: {
        fontFamily: "Georgia",
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
      },
    });

    Object.values(tokens).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });

  it("handles missing node data by skipping without writing", async () => {
    fetchNode.mockResolvedValue({ nodes: {} });
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await generateBlockquoteTokens([variant]);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it("handles empty component input with null values", async () => {
    fetchNode.mockResolvedValue({
      nodes: {
        [variant.nodeId]: { document: {} },
      },
    });

    await generateBlockquoteTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const tokens = written.blockquote[variant.name];

    expect(tokens.container).toEqual({
      backgroundColor: null,
      padding: { top: null, right: null, bottom: null, left: null },
      gap: null,
      width: null,
      height: null,
    });
    expect(tokens.icon).toBeNull();
    expect(tokens.text).toBeNull();

    Object.values(tokens.container).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });
});
