jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
}));

const fs = require("fs");

global.fetch = jest.fn();

const fetchFigmaFile = require("../../../figmaApi/initialisation/figmaTest.js");

describe("fetchFigmaFile", () => {
  const mockJson = { name: "Test Figma File", document: { id: "0:0" } };

  beforeEach(() => {
    process.env.FILE_ID = "test-file-id";
    process.env.FIGMA_TOKEN = "test-token";
  });

  it("returns 200 on a successful fetch", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockJson),
    });

    const result = await fetchFigmaFile();
    expect(result).toBe(200);
  });

  it("writes the fetched data to fullFile.json", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockJson),
    });

    await fetchFigmaFile();

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining("fullFile.json"),
      expect.any(String)
    );
  });

  it("writes valid JSON containing the fetched data", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockJson),
    });

    await fetchFigmaFile();

    const written = fs.writeFileSync.mock.calls[0][1];
    expect(JSON.parse(written)).toEqual(mockJson);
  });

  it("returns undefined when the response is not ok", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 403,
    });

    const result = await fetchFigmaFile();
    expect(result).toBeUndefined();
  });

  it("does not write a file when the response is not ok", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 403,
    });

    await fetchFigmaFile();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("calls the Figma API with the correct file ID and token", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockJson),
    });

    await fetchFigmaFile();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("test-file-id"),
      expect.objectContaining({
        headers: expect.objectContaining({ "X-Figma-Token": "test-token" }),
      })
    );
  });

  it("throws when fetch rejects (network error)", async () => {
    global.fetch.mockRejectedValue(new Error("Network failure"));
    await expect(fetchFigmaFile()).rejects.toThrow("Network failure");
  });
});
