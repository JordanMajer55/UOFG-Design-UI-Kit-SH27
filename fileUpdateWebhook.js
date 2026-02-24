//setting up a file update webhook 

require('dotenv').config();

fetch('https://api.figma.com/v2/webhooks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Figma-Token': process.env.FIGMA_TOKEN,
    },
    body:JSON.stringify({
        event_type: 'FILE_VERSION_UPDATE', 
        team_id: process.env.TEAM_ID,
        passcode: 'Verified',
        file_key: process.env.FILE_ID,
        file_name: 'UofG Component library - CS (Copy)',
        endpoint: `${process.env.NGROK_URL}/updates`, //our new webserver that figma can access - no longer http://localserver.....
        description: 'Webhook to notify for file_updates'

    })
    
})
//prints out the response Figma gives us 
    .then(res => {
        console.log('Status:', res.status);
        return res.json();
    })
    .then(data => console.log('Webhook created: ', data))
    .catch(err => console.error(err));


