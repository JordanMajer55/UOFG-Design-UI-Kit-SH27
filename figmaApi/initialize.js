const generateButtonTokens = require("./initialisation/generateButtonTokens.js");
const generateSearchBoxTokens = require("./initialisation/generateSearchBoxTokens.js");
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

  const TABS_VARIANTS = [
    {
      name: "default",
      position: "24",
      canvas: "0",
      frame: "9",
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
  //await generateSearchBoxTokens(SEARCHBOX_VARIANTS);
  //await generateTabsTokens(TABS_VARIANTS);
  //await generateLogoTokens(LOGO_VARIANRS);
  //await generateHeaderTokens(HEADER_VARIANTS);
  //await generateBreadcrumbTokens(BREADCRUMB_VARIANTS);
}
init();