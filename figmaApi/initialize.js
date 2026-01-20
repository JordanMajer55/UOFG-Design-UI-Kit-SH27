const generateButtonToken = require("./initialisation/generateButtonTokens.js")
require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");

async function init() {
    generateButtonToken("29:364", "Button");
}

init();