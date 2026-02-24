//setting up a file update webhook 

require("dotenv").config();

// Gets webhooks associated with team id and returns them
async function getWebhooks(){
    const response = await fetch(`https://api.figma.com/v2/webhooks?context=team&context_id=${process.env.TEAM_ID}`, {
        method: "GET",
        headers: {
            "X-Figma-Token": process.env.FIGMA_TOKEN
        }
    });

    const webhooks = await response.json();
    return webhooks["webhooks"];
}

// deletes all webhooks given in a json
async function clear() {
    const webhooks = await getWebhooks();
    console.log(webhooks);

    for (const element of webhooks) {
        const response = await fetch(`https://api.figma.com/v2/webhooks/${element.id}?context=team&context_id=${process.env.TEAM_ID}`, {
            method: "DELETE",
            headers: {
                "X-Figma-Token": process.env.FIGMA_TOKEN
            }
        });
    }
    
    console.log(`All Webhooks Cleared`);
    printHooks();
}

async function printHooks() {
    console.log(await getWebhooks());
}

clear();