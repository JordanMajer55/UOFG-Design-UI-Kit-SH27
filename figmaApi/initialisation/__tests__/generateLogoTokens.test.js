const fs = require("fs");
const mockFetch = require("../../../test/mocks/node-fetch.js");
jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

const generateLogoTokens = require("../generateLogoTokens.js");

describe("generateLogoTokens", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    process.env.FILE_ID = "file-123";
    process.env.FIGMA_TOKEN = "token-123";
  });

  it("writes a correctly structured logo token object", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ images: { "logo-1": "https://img/1.png" } }),
    });

    await generateLogoTokens([{ nodeId: "logo-1", fileName: "logo" }]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written).toEqual({
      uogLogo: {
        pngUrl: "https://img/1.png",
        nodeId: "logo-1",
      },
    });

    Object.values(written.uogLogo).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
  });

  it("handles missing nodeId by writing a null pngUrl", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ images: {} }),
    });

    await generateLogoTokens([{ nodeId: undefined, fileName: "logo" }]);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written.uogLogo.pngUrl).toBeNull();
    expect(written.uogLogo.pngUrl).not.toBeUndefined();
  });

  it("throws when the image API returns an error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(
      generateLogoTokens([{ nodeId: "logo-1", fileName: "logo" }])
    ).rejects.toThrow("Image API error: 500");
  });
});
