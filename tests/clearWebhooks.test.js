// clearWebhooks.js auto-executes clear() on require, so we load it fresh per test
// using jest.isolateModules and wait for all async work to settle.

beforeEach(() => {
  process.env.TEAM_ID = "team-123";
  process.env.FIGMA_TOKEN = "test-token";
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

async function flushPromises() {
  // Flush multiple microtask queues to handle chained awaits
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
}

describe("clearWebhooks", () => {
  it("sends a GET request to the Figma webhooks API", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [] }) }) // clear → getWebhooks
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [] }) }); // printHooks → getWebhooks

    jest.isolateModules(() => {
      require("../clearWebhooks.js");
    });

    await flushPromises();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("api.figma.com/v2/webhooks"),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("includes the TEAM_ID in the webhooks request URL", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [] }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [] }) });

    jest.isolateModules(() => {
      require("../clearWebhooks.js");
    });

    await flushPromises();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("team-123"),
      expect.any(Object)
    );
  });

  it("includes the FIGMA_TOKEN in request headers", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [] }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [] }) });

    jest.isolateModules(() => {
      require("../clearWebhooks.js");
    });

    await flushPromises();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ "X-Figma-Token": "test-token" }),
      })
    );
  });

  it("sends a DELETE request for each webhook returned", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [{ id: "wh-1" }, { id: "wh-2" }] }) }) // getWebhooks
      .mockResolvedValueOnce({}) // DELETE wh-1
      .mockResolvedValueOnce({}) // DELETE wh-2
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [] }) }); // printHooks

    jest.isolateModules(() => {
      require("../clearWebhooks.js");
    });

    await flushPromises();

    const deleteCalls = global.fetch.mock.calls.filter(
      ([, opts]) => opts && opts.method === "DELETE"
    );
    expect(deleteCalls).toHaveLength(2);
  });

  it("includes the webhook ID in each DELETE request URL", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [{ id: "wh-abc" }] }) })
      .mockResolvedValueOnce({}) // DELETE
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [] }) }); // printHooks

    jest.isolateModules(() => {
      require("../clearWebhooks.js");
    });

    await flushPromises();

    const deleteCall = global.fetch.mock.calls.find(
      ([, opts]) => opts && opts.method === "DELETE"
    );
    expect(deleteCall[0]).toContain("wh-abc");
  });

  it("makes no DELETE requests when there are no webhooks", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [] }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve({ webhooks: [] }) });

    jest.isolateModules(() => {
      require("../clearWebhooks.js");
    });

    await flushPromises();

    const deleteCalls = global.fetch.mock.calls.filter(
      ([, opts]) => opts && opts.method === "DELETE"
    );
    expect(deleteCalls).toHaveLength(0);
  });
});
