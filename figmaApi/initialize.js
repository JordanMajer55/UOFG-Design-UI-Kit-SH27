const generateButtonTokens = require("./initialisation/generateButtonTokens.js");
const generateSearchBoxTokens = require("./initialisation/generateSearchBoxTokens.js");
const generatePhaseBannerTokens = require("./initialisation/generatePhaseBannerTokens.js")

async function init() {
  const BUTTON_VARIANTS = [
    {
      name: "primary",
      nodeId: "29:364",
      fileName: "Button-Primary",
    },
    {
      name: "secondary",
      nodeId: "29:363",
      fileName: "Button-Secondary",
    },
  ];

  const SEARCHBOX_VARIANTS = [
    {
      name: "default",
      nodeId: "2719:7101",
      fileName: "SearchBox-Default"
    },
  ];

  const PHASEBANNER_VARIANTS = [
    {
      name: "beta",
      nodeId: "43:349",
      fileName: "PhaseBanner-Beta"
    },
  ];

  await generateButtonTokens(BUTTON_VARIANTS);
  await generateSearchBoxTokens(SEARCHBOX_VARIANTS);
  await generatePhaseBannerTokens(PHASEBANNER_VARIANTS);
}

init();