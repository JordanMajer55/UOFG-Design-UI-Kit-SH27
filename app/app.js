var express = require('express');
var app = express();
var figma_port = 3000;
var client_port = 3001;
app.get('/', function (req, res) {
    res.send({ "message": 'Hello World!' });
});
app.listen(figma_port, function () {
});
app.listen(client_port, function () {
});
