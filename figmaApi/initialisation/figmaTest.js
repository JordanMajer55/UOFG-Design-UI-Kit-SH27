//outputs a fullFile.json that contains all the figma components
require("dotenv").config();
const fs = require("fs");

async function fetchFigmaFile() {
  const res = await fetch(
    `https://api.figma.com/v1/files/${process.env.FILE_ID}`,
    {
      headers: { "X-Figma-Token": process.env.FIGMA_TOKEN }
    }
  );

  if (!res.ok) {
    console.log("Token:", process.env.FIGMA_TOKEN);
    console.log("File:", process.env.FILE_ID);
    console.error("ERROR:", res.status);
    return;
  }

  const json = await res.json();
  console.log("SUCCESS! File name:", json.name);

  fs.writeFileSync("./../figmaApi/initialisation/fullFile.json", JSON.stringify(json, null, 2));
  
  return 200;
}

module.exports = fetchFigmaFile;