const generateButtonTokens = require("./initialisation/generateButtonTokens.js");
const generateSearchBoxTokens = require("./initialisation/generateSearchBoxTokens.js");
const generatePhaseBannerTokens = require("./initialisation/generatePhaseBannerTokens.js")
const generateBlockquoteTokens = require("./initialisation/generateBlockquoteTokens.js")
const generateDownloadLinkTokens = require("./initialisation/generateDownloadLinkTokens.js")
const generateTabsTokens = require("./initialisation/generateTabsTokens.js");
const generateLogoTokens = require("./initialisation/generateLogoTokens.js");
const generateHeaderTokens = require("./initialisation/generateHeaderTokens.js");
const generateBreadcrumbTokens = require("./initialisation/generateBreadcrumbTokens.js");

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

  const TABS_VARIANTS = [
    {
      name: "default",
      nodeId: "32:1306",
      fileName: "Tabs-Default"
    },
  ];
  
  const LOGO_VARIANRS = [
    {
    name: "default",
    nodeId: "507:13576",
    fileName: "Logo-Default"
    },
  ];

  const HEADER_VARIANTS = [
  { nodeId: "505:5793", 
    fileName: "Header" },
];

const BREADCRUMB_VARIANTS = [
  { nodeId: "507:13549", 
    fileName: "Breadcrumb"
   },
];

  await generateButtonTokens(BUTTON_VARIANTS);
  await generateSearchBoxTokens(SEARCHBOX_VARIANTS);
  await generateTabsTokens(TABS_VARIANTS);
  await generateLogoTokens(LOGO_VARIANRS);
  await generateHeaderTokens(HEADER_VARIANTS);
  await generateBreadcrumbTokens(BREADCRUMB_VARIANTS);
  await generatePhaseBannerTokens(PHASEBANNER_VARIANTS);
  await generateBlockquoteTokens(BLOCKQUOTE_VARIANTS);
  await generateDownloadLinkTokens(DOWNLOAD_LINK_VARIANTS);
}
init();