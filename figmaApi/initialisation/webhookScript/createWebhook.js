//initialising a webhook 
require("dotenv").config();




fetch(`https://api.figma.com/v1/files/${process.env.FILE_ID}/v2/webhooks`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.FIGMA_TOKEN
    },
    body:JSON.stringify({
        event_type: 'PING',
        context: 'file',
        endpoint: 'https://shaky-pianos-shine.loca.lt/updates',
        status: 'ACTIVE',
        description: 'Webhook to register with Figma file'

    })
    
})