const fs = require("fs");
const fetchNode = require("../../../figmaApi/initialisation/figmaGetNode.js");
const generateButtonTokens = require("../../../figmaApi/initialisation/generateButtonTokens.js");

jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

jest.mock("../../../figmaApi/initialisation/figmaGetNode.js", () => jest.fn());

describe("generateButtonTokens", () => {
  const variant = { nodeId: "btn-1", fileName: "button", name: "primary" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a correctly structured button token object", async () => {
    const component = {
      fills: [{ color: { r: 0, g: 0, b: 1, a: 1 } }],
      cornerRadius: 4,
      absoluteBoundingBox: { width: 120, height: 40 },
      paddingTop: 8,
      paddingRight: 12,
      paddingBottom: 8,
      paddingLeft: 12,
      children: [
        {
          type: "TEXT",
          style: {
            fontFamily: "Helvetica",
            fontWeight: 600,
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

    await generateButtonTokens([variant]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const tokens = written.button[variant.name];

    expect(tokens).toMatchObject({
      backgroundColor: "rgba(0, 0, 255, 1)",
      borderRadius: 4,
      width: 120,
      height: 40,
    });

    expect(tokens.padding).toEqual({
      top: 8,
      right: 12,
      bottom: 8,
      left: 12,
    });

    expect(tokens.typography).toEqual({
      fontFamily: "Helvetica",
      fontWeight: 600,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
    });

    Object.values(tokens).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });

  it("throws when node data is missing", async () => {
    fetchNode.mockResolvedValue({ nodes: {} });

    await expect(generateButtonTokens([variant])).rejects.toThrow();
  });

  it("throws on empty component input", async () => {
    fetchNode.mockResolvedValue({
      nodes: {
        [variant.nodeId]: { document: {} },
      },
    });

    await expect(generateButtonTokens([variant])).rejects.toThrow();
  });

  it("writes the token file using the variant's fileName", async () => {
    const component = {
      fills: [{ color: { r: 0, g: 0, b: 1, a: 1 } }],
      cornerRadius: 4,
      absoluteBoundingBox: { width: 120, height: 40 },
      paddingTop: 8, paddingRight: 12, paddingBottom: 8, paddingLeft: 12,
      children: [{ type: "TEXT", style: { fontFamily: "Helvetica", fontWeight: 600, fontSize: 14, lineHeightPx: 20, letterSpacing: 0 } }],
    };

    fetchNode.mockResolvedValue({
      nodes: { [variant.nodeId]: { document: component } },
    });

    await generateButtonTokens([variant]);

    const writtenPath = fs.writeFileSync.mock.calls[0][0];
    expect(writtenPath).toContain(variant.fileName);
  });

  it("processes multiple variants and writes a file for each", async () => {
    const variant1 = { nodeId: "btn-primary", fileName: "Button-Primary", name: "primary" };
    const variant2 = { nodeId: "btn-secondary", fileName: "Button-Secondary", name: "secondary" };

    const component = {
      fills: [{ color: { r: 0, g: 0, b: 1, a: 1 } }],
      cornerRadius: 4,
      absoluteBoundingBox: { width: 120, height: 40 },
      paddingTop: 8,
      paddingRight: 12,
      paddingBottom: 8,
      paddingLeft: 12,
      children: [
        {
          type: "TEXT",
          style: {
            fontFamily: "Helvetica",
            fontWeight: 600,
            fontSize: 14,
            lineHeightPx: 20,
            letterSpacing: 0,
          },
        },
      ],
    };

    // Return the correct component for whichever nodeId is requested
    fetchNode.mockImplementation((nodeId) =>
      Promise.resolve({ nodes: { [nodeId]: { document: component } } })
    );

    await generateButtonTokens([variant1, variant2]);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
  });
});
