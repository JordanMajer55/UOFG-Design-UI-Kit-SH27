require("dotenv").config();

console.log("=== Environment Check ===");
console.log("FILE_ID:", process.env.FILE_ID);
console.log("TEAM_ID:", process.env.TEAM_ID);
console.log("TOKEN exists:", !!process.env.FIGMA_TOKEN);
console.log("TOKEN preview:", process.env.FIGMA_TOKEN?.substring(0, 10) + "...");

console.log("\n=== Testing Token ===");
// First test if your token works at all
fetch('https://api.figma.com/v1/me', {
    headers: {
        'Authorization': `Bearer ${process.env.FIGMA_TOKEN}`
    }
})
.then(res => {
    console.log("Auth test status:", res.status);
    return res.json();
})
.then(data => {
    console.log("Logged in as:", data.email);
    console.log("\n=== Trying PING Webhook ===");
    
    // Now try creating a PING webhook
    return fetch(`https://api.figma.com/v2/webhooks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.FIGMA_TOKEN}`
        },
        body: JSON.stringify({
            event_type: 'PING',
            team_id: process.env.TEAM_ID,
            endpoint: 'https://mean-webs-find.loca.lt/updates',
            description: 'Test PING webhook'
        })
    });
})
.then(res => {
    console.log("Webhook creation status:", res.status);
    return res.json();
})
.then(data => {
    console.log("Webhook response:", JSON.stringify(data, null, 2));
})
.catch(err => console.error("Error:", err));