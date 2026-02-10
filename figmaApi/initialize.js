const generateButtonTokens = require("./initialisation/generateButtonTokens.js");
const generateSearchBoxTokens = require("./initialisation/generateSearchBoxTokens.js");

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

  const TABS = [
    {
      name: "default",
      nodeId: "32:1306",
      fileName: "SearchBox-Default"
    },
  ];
  
  await generateButtonTokens(BUTTON_VARIANTS);
  await generateSearchBoxTokens(SEARCHBOX_VARIANTS);
}

init();