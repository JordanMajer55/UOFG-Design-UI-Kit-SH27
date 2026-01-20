const express = require('express');
const app = express();
const fs = require("fs/promises");
const port = 3000;

async function getJson(filename: string) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

app.get('/button-primary', async (req: any, res: any) => {
    const json = await getJson("./../figmaApi/initialisation/Button.json")
    if (json != null) {
        res.json(json);
    }
    else {
        res.status(500).json({error: "Error Occured While While Fetching Data"});
    }
})

app.listen(port, () => {

})