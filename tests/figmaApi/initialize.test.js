jest.mock("../../figmaApi/initialisation/generateButtonTokens.js", () => jest.fn().mockResolvedValue());
jest.mock("../../figmaApi/initialisation/generateSearchBoxTokens.js", () => jest.fn().mockResolvedValue());
jest.mock("../../figmaApi/initialisation/generatePhaseBannerTokens.js", () => jest.fn().mockResolvedValue());
jest.mock("../../figmaApi/initialisation/generateBlockquoteTokens.js", () => jest.fn().mockResolvedValue());
jest.mock("../../figmaApi/initialisation/generateDownloadLinkTokens.js", () => jest.fn().mockResolvedValue());
jest.mock("../../figmaApi/initialisation/generateTabsTokens.js", () => jest.fn().mockResolvedValue());
jest.mock("../../figmaApi/initialisation/generateLogoTokens.js", () => jest.fn().mockResolvedValue());
jest.mock("../../figmaApi/initialisation/generateHeaderTokens.js", () => jest.fn().mockResolvedValue());
jest.mock("../../figmaApi/initialisation/generateBreadcrumbTokens.js", () => jest.fn().mockResolvedValue());

const generateButtonTokens = require("../../figmaApi/initialisation/generateButtonTokens.js");
const generateSearchBoxTokens = require("../../figmaApi/initialisation/generateSearchBoxTokens.js");
const generatePhaseBannerTokens = require("../../figmaApi/initialisation/generatePhaseBannerTokens.js");
const generateBlockquoteTokens = require("../../figmaApi/initialisation/generateBlockquoteTokens.js");
const generateDownloadLinkTokens = require("../../figmaApi/initialisation/generateDownloadLinkTokens.js");
const generateTabsTokens = require("../../figmaApi/initialisation/generateTabsTokens.js");
const generateLogoTokens = require("../../figmaApi/initialisation/generateLogoTokens.js");
const generateHeaderTokens = require("../../figmaApi/initialisation/generateHeaderTokens.js");
const generateBreadcrumbTokens = require("../../figmaApi/initialisation/generateBreadcrumbTokens.js");

const init = require("../../figmaApi/initialize.js");

describe("init", () => {
  it("calls all nine token generators", async () => {
    await init();
    expect(generateButtonTokens).toHaveBeenCalled();
    expect(generateSearchBoxTokens).toHaveBeenCalled();
    expect(generatePhaseBannerTokens).toHaveBeenCalled();
    expect(generateBlockquoteTokens).toHaveBeenCalled();
    expect(generateDownloadLinkTokens).toHaveBeenCalled();
    expect(generateTabsTokens).toHaveBeenCalled();
    expect(generateLogoTokens).toHaveBeenCalled();
    expect(generateHeaderTokens).toHaveBeenCalled();
    expect(generateBreadcrumbTokens).toHaveBeenCalled();
  });

  it("passes primary and secondary variants to generateButtonTokens", async () => {
    await init();
    const [variants] = generateButtonTokens.mock.calls[0];
    expect(variants).toContainEqual(expect.objectContaining({ name: "primary" }));
    expect(variants).toContainEqual(expect.objectContaining({ name: "secondary" }));
  });

  it("passes a default variant to generateSearchBoxTokens", async () => {
    await init();
    const [variants] = generateSearchBoxTokens.mock.calls[0];
    expect(variants).toContainEqual(expect.objectContaining({ name: "default" }));
  });

  it("passes a beta variant to generatePhaseBannerTokens", async () => {
    await init();
    const [variants] = generatePhaseBannerTokens.mock.calls[0];
    expect(variants).toContainEqual(expect.objectContaining({ name: "beta" }));
  });

  it("passes the correct nodeIds for the primary and secondary button variants", async () => {
    await init();
    const [variants] = generateButtonTokens.mock.calls[0];
    expect(variants[0].nodeId).toBe("29:364");
    expect(variants[1].nodeId).toBe("29:363");
  });

  it("passes the correct nodeId for the phase banner beta variant", async () => {
    await init();
    const [variants] = generatePhaseBannerTokens.mock.calls[0];
    expect(variants[0].nodeId).toBe("43:349");
  });

  it("passes the correct nodeId for the logo variant", async () => {
    await init();
    const [variants] = generateLogoTokens.mock.calls[0];
    expect(variants[0].nodeId).toBe("507:13576");
  });

  it("passes the correct nodeId for the breadcrumb variant", async () => {
    await init();
    const [variants] = generateBreadcrumbTokens.mock.calls[0];
    expect(variants[0].nodeId).toBe("507:13549");
  });

  it("each generator is called with an array of variants containing a nodeId and fileName", async () => {
    await init();
    const allGenerators = [
      generateButtonTokens,
      generateSearchBoxTokens,
      generatePhaseBannerTokens,
      generateBlockquoteTokens,
      generateDownloadLinkTokens,
      generateTabsTokens,
      generateLogoTokens,
      generateHeaderTokens,
      generateBreadcrumbTokens,
    ];
    for (const generator of allGenerators) {
      const [variants] = generator.mock.calls[0];
      expect(Array.isArray(variants)).toBe(true);
      variants.forEach((v) => {
        expect(v).toHaveProperty("nodeId");
        expect(v).toHaveProperty("fileName");
      });
    }
  });
});
