//initialising a webhook 


require("dotenv").config();


fetch(`https://api.figma.com/v2/files/${process.env.FILE_ID}/webhooks`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIGMA_TOKEN}`
    },
    body:JSON.stringify({
        event_type: 'PING',
        team_id: process.env.TEAM_ID,
        context: 'file',
        endpoint: 'https://mean-webs-find.loca.lt/updates',
        status: 'ACTIVE',
        description: 'Webhook to test implementation'

    })
    
})

    .then(res => {
        console.log("Status:", res.status);
        return res.json();
    })
    .then(data => console.log(data))
    .catch(err => console.error(err));
    console.log(process.env.FILE_ID);
    console.log(process.env.FIGMA_TOKEN);
