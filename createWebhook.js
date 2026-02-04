//initialising a webhook 

require("dotenv").config();

fetch(`https://api.figma.com/v2/webhooks`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Figma-Token': process.env.FIGMA_TOKEN,
    },
    body:JSON.stringify({
        event_type: 'PING', //just a PING event so this just initialises it - will create another issue to let it log file updates later
        team_id: process.env.TEAM_ID,
        passcode: 'Verified',
        //file_key: process.env.FILE_ID,
        endpoint: 'https://mean-webs-find.loca.lt/updates', //our new webserver that figma can access - no longer http://localserver.....
        description: 'Webhook to test implementation'

    })
    
})
//prints out the response Figma gives us 
    .then(res => {
        console.log("Status:", res.status);
        return res.json();
    })
    .then(data => console.log(data))
    .catch(err => console.error(err));


