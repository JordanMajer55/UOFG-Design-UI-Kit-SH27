async function test() {
    const response = await fetch("http://localhost:3000/button-primary");
    const data = await response.json();
    console.log(data)
}

test();