const express = require('express');
const app = express()
const figma_port = 3000
const client_port = 3001

app.get('/', (req: any, res: any) => {
    res.send({"message" : 'Hello World!'})
})

app.listen(figma_port, () => {

})

app.listen(client_port, () => {
    
})