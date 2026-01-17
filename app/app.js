const express = require('express');
const app = express();
const fs = require("fs/promises");
const port = 3000;

async function getJson(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

//ENDPOINTS (go at the end of webserver i.e. http:/.....)

app.get('/', (req, res) => {
    res.send('This is the local webserver');
})

//endpoint for client to receive the json files - usually for a specific component
app.get('/button-primary', async (req, res) => {
    const json = await getJson("./../buttonTokens.json");
    if (json != null) {
        res.json(json);
    }
    else {
        res.status(500).json({error: "Error Occured While While Fetching Data"});
    }
})

//Creating a webhook endpoint - receives updates at this endpoint
app.post('/v2/webhooks',() =>{
    console.log(req.body);
    //whatever we decide to do with this data - put it in a new file 
    // or update a curr ver
    //extract whats needed and put through a generating token func
    console.log('Updating changes made ....')
    res.status(200)
})

app.listen(port, () => {
    console.log(`This is the local webserver, running at http://localhost:${port}`);
})