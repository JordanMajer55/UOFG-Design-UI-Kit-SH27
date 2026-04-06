// fileUpdateWebhook.js calls fetch immediately on require, so we load it
// fresh per test using jest.isolateModules and flush pending promises.

beforeEach(() => {
  process.env.FIGMA_TOKEN = "test-token";
  process.env.TEAM_ID = "team-123";
  process.env.FILE_ID = "file-abc";
  process.env.NGROK_URL = "https://test.ngrok.io";
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

async function flushPromises() {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
}

describe("fileUpdateWebhook", () => {
  it("sends a POST request to the Figma webhooks API", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({ id: "webhook-1" }),
    });

    jest.isolateModules(() => {
      require("../fileUpdateWebhook.js");
    });

    await flushPromises();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.figma.com/v2/webhooks",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("sends the FILE_VERSION_UPDATE event type", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    jest.isolateModules(() => {
      require("../fileUpdateWebhook.js");
    });

    await flushPromises();

    const [, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.event_type).toBe("FILE_VERSION_UPDATE");
  });

  it("includes the TEAM_ID in the request body", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    jest.isolateModules(() => {
      require("../fileUpdateWebhook.js");
    });

    await flushPromises();

    const [, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.context_id).toBe("team-123");
  });

  it("sets the webhook endpoint using the NGROK_URL env var", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    jest.isolateModules(() => {
      require("../fileUpdateWebhook.js");
    });

    await flushPromises();

    const [, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.endpoint).toContain("https://test.ngrok.io");
  });

  it("uses the FIGMA_TOKEN in the request headers", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    jest.isolateModules(() => {
      require("../fileUpdateWebhook.js");
    });

    await flushPromises();

    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers["X-Figma-Token"]).toBe("test-token");
  });

  it("includes the FILE_ID in the request body", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    jest.isolateModules(() => {
      require("../fileUpdateWebhook.js");
    });

    await flushPromises();

    const [, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.file_key).toBe("file-abc");
  });
});
