async function test() {
    const response = await fetch("http://localhost:3000/");
    const data = await response.json();
    console.log(data.message)
}

test();