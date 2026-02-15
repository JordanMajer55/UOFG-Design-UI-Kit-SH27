const generateButtonTokens = require("./initialisation/generateButtonTokens.js");
const generateSearchBoxTokens = require("./initialisation/generateSearchBoxTokens.js");
const generatePhaseBannerTokens = require("./initialisation/generatePhaseBannerTokens.js")
const generateBlockquoteTokens = require("./initialisation/generateBlockquoteTokens.js")
const generateDownloadLinkTokens = require("./initialisation/generateDownloadLinkTokens.js")

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

  const BLOCKQUOTE_VARIANTS = [
    {
      name: "default",
      nodeId: "54:169",
      fileName: "Blockquote"
    },
  ];

  const DOWNLOAD_LINK_VARIANTS = [
    {
      name: "default",
      nodeId: "53:114",
      fileName: "DownloadLink-Default"
    }
  ]

  await generateButtonTokens(BUTTON_VARIANTS);
  await generateSearchBoxTokens(SEARCHBOX_VARIANTS);
  await generatePhaseBannerTokens(PHASEBANNER_VARIANTS);
  await generateBlockquoteTokens(BLOCKQUOTE_VARIANTS);
  await generateDownloadLinkTokens(DOWNLOAD_LINK_VARIANTS);
}

init();