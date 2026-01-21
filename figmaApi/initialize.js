const generateButtonTokens = require("./initialisation/generateButtonTokens.js");

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

  await generateButtonTokens(BUTTON_VARIANTS);
}

init();
