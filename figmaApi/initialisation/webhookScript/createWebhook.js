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
        endpoint: 'https://nine-windows-lick.loca.lt/updates',
        status: 'ACTIVE',
        description: 'PING webhook to test implementation'

    })
    
})

    .then(res => {
        console.log("Status:", res.status);
        return res.json();
    })
    .then(data => console.log(data))
    .catch(err => console.error(err));