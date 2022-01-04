const express = require("express");

run().catch(error => console.log(error));

async function run(){
    const app = express();

    app.use(express.static("./"));

    app.all("/", (request, response) => {
        response.status(200).send("Hello from client");
    })

    await app.listen(3000);
    console.log("Client server runing on port 3001");
}