//initialising a webhook 


require("dotenv").config();


fetch(`https://api.figma.com/v2/webhooks`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Figma-Token': process.env.FIGMA_TOKEN,
    },
    body:JSON.stringify({
        event_type: 'PING',
        team_id: process.env.TEAM_ID,
        //file_key: process.env.FILE_ID,
        endpoint: 'https://mean-webs-find.loca.lt/updates',
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
    console.log(process.env.TEAM_ID);

