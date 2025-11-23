async function test() {
    const response = await fetch("http://172.21.160.1:3000/");
    const data = await response.json();
    console.log(data.message)
}

test();