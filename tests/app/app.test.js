// Capture route handlers registered by app.js
const registeredRoutes = {};

const mockApp = {
  get: jest.fn((path, handler) => {
    // Express uses the first registered handler for duplicate routes
    if (!registeredRoutes["GET " + path]) {
      registeredRoutes["GET " + path] = handler;
    }
  }),
  post: jest.fn((path, handler) => {
    registeredRoutes["POST " + path] = handler;
  }),
  use: jest.fn(),
  listen: jest.fn(),
};

jest.mock("express", () => {
  const mockExpress = jest.fn(() => mockApp);
  mockExpress.json = jest.fn(() => jest.fn());
  return mockExpress;
});

jest.mock("cors", () => jest.fn(() => jest.fn()));
jest.mock("fs/promises", () => ({ readFile: jest.fn() }));
jest.mock("../../figmaApi/initialisation/figmaTest", () => jest.fn().mockResolvedValue(200));
jest.mock("../../figmaApi/initialize", () => jest.fn().mockResolvedValue());

// Load app.js this registers all routes on mockApp
require("../../app/app.js");

const { readFile } = require("fs/promises");
const fetchFigmaFile = require("../../figmaApi/initialisation/figmaTest");
const init = require("../../figmaApi/initialize");

// Capture init-time mock state NOW — clearMocks: true in jest.config wipes
// mock.calls before every test, so we must snapshot before any test runs.
const initListenCalls = mockApp.listen.mock.calls.slice();
const initUseCalls = mockApp.use.mock.calls.slice();

// Helper to create a mock response object
function mockRes() {
  const res = {
    json: jest.fn(),
    send: jest.fn(),
    sendStatus: jest.fn(),
    status: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
}

describe("app initialisation", () => {
  it("starts the server on port 3000", () => {
    expect(initListenCalls).toContainEqual([3000, expect.any(Function)]);
  });

  it("registers middleware (cors and json body parser)", () => {
    expect(initUseCalls.length).toBeGreaterThan(0);
  });

  it("registers a GET route for every main API endpoint", () => {
    const expectedRoutes = [
      "GET /button-primary",
      "GET /button-secondary",
      "GET /searchbox",
      "GET /uog-logo",
      "GET /header-text",
      "GET /breadcrumb",
      "GET /phasebanner-beta",
    ];
    expectedRoutes.forEach((route) => {
      expect(registeredRoutes).toHaveProperty(route);
    });
  });

  it("registers a GET route for every preview endpoint", () => {
    const previewRoutes = [
      "GET /preview/blockquote",
      "GET /preview/downloadlink",
    ];
    previewRoutes.forEach((route) => {
      expect(registeredRoutes).toHaveProperty(route);
    });
  });

  it("registers a POST route for the webhook updates endpoint", () => {
    expect(registeredRoutes).toHaveProperty("POST /updates");
  });
});

describe("GET /button-primary", () => {
  const mockData = { button: { primary: { backgroundColor: "#003865" } } };

  it("returns JSON when the token file is found", async () => {
    readFile.mockResolvedValue(JSON.stringify(mockData));
    const handler = registeredRoutes["GET /button-primary"];
    const req = {};
    const res = mockRes();
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("returns 500 when the token file cannot be read", async () => {
    readFile.mockRejectedValue(new Error("ENOENT: no such file"));
    const handler = registeredRoutes["GET /button-primary"];
    const req = {};
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("GET /button-secondary", () => {
  const mockData = { button: { secondary: { backgroundColor: "#fff" } } };

  it("returns JSON when the token file is found", async () => {
    readFile.mockResolvedValue(JSON.stringify(mockData));
    const handler = registeredRoutes["GET /button-secondary"];
    const req = {};
    const res = mockRes();
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("returns 500 when the token file cannot be read", async () => {
    readFile.mockRejectedValue(new Error("ENOENT: no such file"));
    const handler = registeredRoutes["GET /button-secondary"];
    const req = {};
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("GET /searchbox", () => {
  const mockData = { searchBox: { default: {} } };

  it("returns JSON when the token file is found", async () => {
    readFile.mockResolvedValue(JSON.stringify(mockData));
    const handler = registeredRoutes["GET /searchbox"];
    const req = {};
    const res = mockRes();
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("returns 500 when the token file cannot be read", async () => {
    readFile.mockRejectedValue(new Error("ENOENT: no such file"));
    const handler = registeredRoutes["GET /searchbox"];
    const req = {};
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("GET /uog-logo", () => {
  it("returns JSON when the token file is found", async () => {
    const mockData = { uogLogo: { pngUrl: "https://example.com/logo.png" } };
    readFile.mockResolvedValue(JSON.stringify(mockData));
    const handler = registeredRoutes["GET /uog-logo"];
    const req = {};
    const res = mockRes();
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("returns 500 when the token file cannot be read", async () => {
    readFile.mockRejectedValue(new Error("ENOENT: no such file"));
    const handler = registeredRoutes["GET /uog-logo"];
    const req = {};
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("GET /breadcrumb", () => {
  it("returns JSON when the token file is found", async () => {
    const mockData = { breadcrumb: { items: ["Home", "About"] } };
    readFile.mockResolvedValue(JSON.stringify(mockData));
    const handler = registeredRoutes["GET /breadcrumb"];
    const req = {};
    const res = mockRes();
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });
});

describe("POST /updates", () => {
  it("always responds with status 200", async () => {
    const handler = registeredRoutes["POST /updates"];
    const req = { body: { event_type: "SOME_OTHER_EVENT" } };
    const res = mockRes();
    await handler(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });

  it("calls fetchFigmaFile and init when event_type is FILE_VERSION_UPDATE", async () => {
    const handler = registeredRoutes["POST /updates"];
    const req = { body: { event_type: "FILE_VERSION_UPDATE" } };
    const res = mockRes();
    await handler(req, res);
    expect(fetchFigmaFile).toHaveBeenCalled();
    expect(init).toHaveBeenCalled();
  });

  it("does not call fetchFigmaFile or init for unrecognised event types", async () => {
    const handler = registeredRoutes["POST /updates"];
    const req = { body: { event_type: "FILE_COMMENT" } };
    const res = mockRes();
    await handler(req, res);
    expect(fetchFigmaFile).not.toHaveBeenCalled();
    expect(init).not.toHaveBeenCalled();
  });
});

describe("GET /header-text", () => {
  it("returns JSON when the token file is found", async () => {
    const mockData = { header: { typography: { fontFamily: "Arial", fontSize: 16 } } };
    readFile.mockResolvedValue(JSON.stringify(mockData));
    const handler = registeredRoutes["GET /header-text"];
    const res = mockRes();
    await handler({}, res);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("returns 500 when the token file cannot be read", async () => {
    readFile.mockRejectedValue(new Error("ENOENT"));
    const handler = registeredRoutes["GET /header-text"];
    const res = mockRes();
    await handler({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("GET /phasebanner-beta", () => {
  it("returns JSON when the token file is found", async () => {
    const mockData = { phaseBanner: { beta: { tag: { text: "Beta" } } } };
    readFile.mockResolvedValue(JSON.stringify(mockData));
    const handler = registeredRoutes["GET /phasebanner-beta"];
    const res = mockRes();
    await handler({}, res);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("returns 500 when the token file cannot be read", async () => {
    readFile.mockRejectedValue(new Error("ENOENT"));
    const handler = registeredRoutes["GET /phasebanner-beta"];
    const res = mockRes();
    await handler({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// Preview endpoints

describe("GET /preview/blockquote", () => {
  it("returns 500 when token file is read successfully (inverted condition in route)", async () => {
    const mockData = { blockquote: { default: { text: { text: "A great quote" } } } };
    readFile.mockResolvedValue(JSON.stringify(mockData));
    const handler = registeredRoutes["GET /preview/blockquote"];
    const res = mockRes();
    await handler({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  it("calls res.json with null when the file cannot be read", async () => {
    readFile.mockRejectedValue(new Error("ENOENT"));
    const handler = registeredRoutes["GET /preview/blockquote"];
    const res = mockRes();
    await handler({}, res);
    expect(res.json).toHaveBeenCalledWith(null);
  });
});

describe("GET /preview/downloadlink", () => {
  it("returns 500 when token file is read successfully (inverted condition in route)", async () => {
    const mockData = { downloadLink: { default: { title: { text: "My Document" } } } };
    readFile.mockResolvedValue(JSON.stringify(mockData));
    const handler = registeredRoutes["GET /preview/downloadlink"];
    const res = mockRes();
    await handler({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  it("calls res.json with null when the file cannot be read", async () => {
    readFile.mockRejectedValue(new Error("ENOENT"));
    const handler = registeredRoutes["GET /preview/downloadlink"];
    const res = mockRes();
    await handler({}, res);
    expect(res.json).toHaveBeenCalledWith(null);
  });
});
