const fs = require("fs");
const fetchNode = require("../../../figmaApi/initialisation/figmaGetNode.js");
const generateBreadcrumbTokens = require("../../../figmaApi/initialisation/generateBreadcrumbTokens.js");

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("../../../figmaApi/initialisation/figmaGetNode.js", () => jest.fn());

describe("generateBreadcrumbTokens", () => {
  const variant = { nodeId: "bc-1", fileName: "breadcrumb", name: "default" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a correctly structured breadcrumb token object", async () => {
    const component = {
      itemSpacing: 6,
      paddingTop: 4,
      paddingRight: 6,
      paddingBottom: 4,
      paddingLeft: 6,
      absoluteBoundingBox: { width: 220, height: 32 },
      children: [
        {
          type: "TEXT",
          characters: "Home",
          absoluteBoundingBox: { x: 0, y: 10, width: 40, height: 12 },
          style: {
            fontFamily: "Arial",
            fontWeight: 400,
            fontSize: 14,
            lineHeightPx: 18,
            letterSpacing: 0,
          },
        },
        {
          type: "TEXT",
          characters: "Section",
          absoluteBoundingBox: { x: 50, y: 11, width: 60, height: 12 },
          style: {
            fontFamily: "Arial",
            fontWeight: 400,
            fontSize: 14,
            lineHeightPx: 18,
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

    await generateBreadcrumbTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written).toHaveProperty("breadcrumb");
    expect(written.breadcrumb.items).toEqual(["Home", "Section"]);
    expect(written.breadcrumb.typography).toMatchObject({
      fontFamily: "Arial",
      fontWeight: 400,
      fontSize: 14,
      lineHeightPx: 18,
      letterSpacing: 0,
    });
    expect(written.breadcrumb.size).toMatchObject({ width: 220, height: 32 });

    Object.values(written.breadcrumb).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });

  it("writes the token file using the variant's fileName", async () => {
    const component = {
      itemSpacing: 6,
      paddingTop: 4, paddingRight: 6, paddingBottom: 4, paddingLeft: 6,
      absoluteBoundingBox: { width: 220, height: 32 },
      children: [
        { type: "TEXT", characters: "Home", absoluteBoundingBox: { x: 0, y: 10, width: 40, height: 12 }, style: { fontFamily: "Arial", fontWeight: 400, fontSize: 14, lineHeightPx: 18, letterSpacing: 0 } },
      ],
    };

    fetchNode.mockResolvedValue({
      nodes: { [variant.nodeId]: { document: component } },
    });

    await generateBreadcrumbTokens([variant]);

    const writtenPath = fs.writeFileSync.mock.calls[0][0];
    expect(writtenPath).toContain(variant.fileName);
  });

  it("throws when node data is missing", async () => {
    fetchNode.mockResolvedValue({ nodes: {} });

    await expect(generateBreadcrumbTokens([variant])).rejects.toThrow(
      "No document found for nodeId=bc-1"
    );
  });

  it("handles empty component input with null values", async () => {
    fetchNode.mockResolvedValue({
      nodes: {
        [variant.nodeId]: { document: {} },
      },
    });

    await generateBreadcrumbTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written.breadcrumb).toEqual({
      items: null,
      typography: null,
      itemSpacing: null,
      paddingTop: null,
      paddingRight: null,
      paddingBottom: null,
      paddingLeft: null,
      size: null,
    });

    Object.values(written.breadcrumb).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });
});
