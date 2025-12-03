var express = require('express');
var app = express();
var figma_port = 3000;
var client_port = 3001;

app.get('/', function (req, res) {
    res.send({ "message": 'Hello World!' });
});

//webhook endpoint 
app.post('/webhook', (req, res) => {
    console.log("Webhook received:", req.body);
    res.sendStatus(200);
});


app.listen(figma_port, function () {
    console.log("Server running...");
});
app.listen(client_port, function () {
});
