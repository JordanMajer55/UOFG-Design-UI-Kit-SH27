const fs = require("fs");
const fetchNode = require("../../../figmaApi/initialisation/figmaGetNode.js");
const generateDownloadLinkTokens = require("../../../figmaApi/initialisation/generateDownloadLinkTokens.js");

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("../../../figmaApi/initialisation/figmaGetNode.js", () => jest.fn());

describe("generateDownloadLinkTokens", () => {
  const variant = { nodeId: "dl-1", fileName: "download", name: "default" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a correctly structured download link token object", async () => {
    const component = {
      fills: [{ color: { r: 1, g: 1, b: 1, a: 1 } }],
      strokes: [{ color: { r: 0, g: 0, b: 1, a: 1 } }],
      individualStrokeWeights: { left: 4 },
      absoluteBoundingBox: { width: 320, height: 80 },
      paddingTop: 8,
      paddingRight: 12,
      paddingBottom: 8,
      paddingLeft: 12,
      itemSpacing: 6,
      children: [
        {
          type: "TEXT",
          name: "Document title",
          characters: "Guide PDF",
          fills: [{ color: { r: 0, g: 0, b: 0, a: 1 } }],
          style: {
            fontFamily: "Arial",
            fontWeight: 600,
            fontSize: 16,
            lineHeightPx: 20,
            letterSpacing: 0,
          },
        },
        {
          type: "TEXT",
          name: "PDF meta",
          characters: "PDF, 2MB",
          fills: [{ color: { r: 0.4, g: 0.4, b: 0.4, a: 1 } }],
          style: {
            fontFamily: "Arial",
            fontWeight: 400,
            fontSize: 12,
            lineHeightPx: 16,
            letterSpacing: 0,
          },
        },
        {
          type: "LINE",
          name: "Line 1",
          strokes: [{ color: { r: 0.8, g: 0.8, b: 0.8, a: 1 } }],
          absoluteBoundingBox: { width: 280, height: 1 },
        },
        {
          type: "VECTOR",
          fills: [{ color: { r: 0, g: 0, b: 0, a: 1 } }],
          absoluteBoundingBox: { width: 16, height: 16 },
        },
      ],
    };

    fetchNode.mockResolvedValue({
      nodes: {
        [variant.nodeId]: { document: component },
      },
    });

    await generateDownloadLinkTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const tokens = written.downloadLink[variant.name];

    expect(tokens.container).toMatchObject({
      backgroundColor: "rgba(255, 255, 255, 1)",
      width: 320,
      height: 80,
      padding: { top: 8, right: 12, bottom: 8, left: 12 },
      gap: 6,
    });

    expect(tokens.accentBar).toMatchObject({
      color: "rgba(0, 0, 255, 1)",
      width: 4,
      height: 80,
    });

    expect(tokens.title).toMatchObject({
      text: "Guide PDF",
      color: "rgba(0, 0, 0, 1)",
      typography: {
        fontFamily: "Arial",
        fontWeight: 600,
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0,
      },
    });

    expect(tokens.meta).toMatchObject({
      text: "PDF, 2MB",
      color: "rgba(102, 102, 102, 1)",
      typography: {
        fontFamily: "Arial",
        fontWeight: 400,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0,
      },
    });

    expect(tokens.divider).toMatchObject({
      color: "rgba(204, 204, 204, 1)",
      width: 280,
      height: 1,
    });

    expect(tokens.icon).toMatchObject({
      color: "rgba(0, 0, 0, 1)",
      width: 16,
      height: 16,
    });

    Object.values(tokens).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });

  it("handles missing node data by skipping without writing", async () => {
    fetchNode.mockResolvedValue({ nodes: {} });
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await generateDownloadLinkTokens([variant]);

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

    await generateDownloadLinkTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const tokens = written.downloadLink[variant.name];

    expect(tokens.container).toEqual({
      backgroundColor: null,
      width: null,
      height: null,
      padding: { top: null, right: null, bottom: null, left: null },
      gap: null,
    });
    expect(tokens.accentBar).toBeNull();
    expect(tokens.title).toBeNull();
    expect(tokens.meta).toBeNull();
    expect(tokens.divider).toBeNull();
    expect(tokens.icon).toBeNull();

    Object.values(tokens.container).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });
});
