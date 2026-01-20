function applyButtonStyle() {
}

async function styleButtonByClass(name, type) {
    try{
        const response = await fetch(`http://localhost:3000/button-${type}`);
        if (!response.ok) {
            console.error("Failed to fetch button json");
            return;
        }

        const fullData = await response.json();
        const data = fullData.button[type];

        //console.log(data);
        const btns = document.getElementsByClassName(`${name}`);
        Array.from(btns).forEach((btn) => {
            Object.assign(btn.style, {
                backgroundColor: data.backgroundColor,
                borderRadius: `${data.borderRadius}px`,
                width: `${data.width}px`,
                height: `${data.height}px`,
                padding: `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`,
                fontFamily: `"${data.typography.fontFamily}"`,
                fontWeight: data.typography.fontWeight,
                fontSize: `${data.typography.fontSize}px`,
                lineHeight: `${data.typography.lineHeight}px`,
                letterSpacing: `${data.typography.letterSpacing}px`,
                border: "none",
            });
        });
    }
    catch(err) {
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    styleButtonByClass("main", "primary");
});