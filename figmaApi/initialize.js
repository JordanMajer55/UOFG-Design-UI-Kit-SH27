const generateButtonTokens = require("./initialisation/generateButtonTokens.js");
const generateSearchBoxTokens = require("./initialisation/generateSearchBoxTokens.js");
const generateTabsTokens = require("./initialisation/generateTabsTokens.js");

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

  const TABS_VARIANTS = [
    {
      name: "default",
      nodeId: "32:1306",
      fileName: "Tabs-Default"
    },
  ];
  
  await generateButtonTokens(BUTTON_VARIANTS);
  await generateSearchBoxTokens(SEARCHBOX_VARIANTS);
  await generateTabsTokens(TABS_VARIANTS);
}

init();