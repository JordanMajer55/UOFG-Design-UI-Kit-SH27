const express = require('express');
const app = express();
app.use(express.json());
const fs = require("fs/promises");
const port = 3000;
const path = require("path");
const prefix = path.join(__dirname, '../figmafiles');
const cors = require("cors"); // only needed to be able to test on same machine as API
app.use(cors());

// function to read requested json file
async function getJson(filename: string) {
    try {
        const data = await fs.readFile(prefix + filename, 'utf8');
        return JSON.parse(data);
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

// end-point point for primary button
app.get('/button-primary', async (req: any, res: any) => {
  const json = await getJson("Button-Primary.json");
  if (json != null) {
    res.json(json);
  } else {
    res.status(500).json({ error: "Error Occured While While Fetching Data" });
  }
});

app.get('/button-secondary', async (req: any, res: any) => {
  const json = await getJson("Button-Secondary.json");
  if (json != null) {
    res.json(json);
  } else {
    res.status(500).json({ error: "Error Occured While While Fetching Data" });
  }
});

app.get('/header-text', async (req: any, res: any) => {
  const json = await getJson("Header.json");
  if (json != null) {
    res.json(json);
  } else {
    res.status(500).json({ error: "Error fetching Header" });
  }
});

app.get('/uog-logo', async (req: any, res: any) => {
  const json = await getJson("Logo-Default.json");
  if (json != null) {
    res.json(json);
  } else {
    res.status(500).json({ error: "Error fetching Logo" });
  }
});

app.get('/breadcrumb', async (req: any, res: any) => {
  const json = await getJson("Breadcrumb.json");
  if (json != null) {
    res.json(json);
  } else {
    res.status(500).json({ error: "Error fetching Breadcrumb" });
  }
});

app.get('/searchbox', async (req: any, res: any) => {
    const json = await getJson("SearchBox-Default.json");
    if (json) res.json(json);
    else res.status(500).json({ error: "Error fetching SearchBox" });
});

app.get("/phasebanner-beta", async (req: any, res: any) => {
    const json = await getJson("PhaseBanner-Beta.json");
    if (json) res.json(json);
    else res.status(500).json({ error: "Error fetching PhaseBanner-Beta" });
});

app.get("/preview/blockquote", async (req: any, res: any) => {
    const json = await getJson("Blockquote.json");
    if (json) res.json(json);
    else res.status(500).json({ error: "Error fetching Blockquote" });
});

app.get("/preview/downloadlink", async (req: any, res: any) => {
  const json = await getJson("DownloadLink-Default.json");
  if (json) res.json(json);
  else res.status(500).json({ error: "Error fetching DownloadLink-Default" });

});

//Creating a webhook endpoint - receives updates at this endpoint
const fetchFigmaFile = require('../figmaApi/initialisation/figmaTest')
const init = require('../figmaApi/initialize')

app.post('/updates',async (req: any,res: any) =>{
    res.sendStatus(200);
    console.log('Updating changes made ....');
    const {event_type} = req.body;
    if (event_type === 'FILE_VERSION_UPDATE'){
        const response = await fetchFigmaFile();
        await init();
    }
    
})

app.listen(port, () => {
    console.log(`This is the local webserver, running at http://localhost:${port}`);
})