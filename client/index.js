const express = require("express");
const cors = require("cors");

run().catch(error => console.log(error));

async function run(){
    const app = express();

    app.use(express.json());
    app.use(cors({origin: "http://localhost:3000"}))

    app.all("/", (request, response) => {
        response.status(200).send("Hello from client");
    })

    app.post("/login", (request, response) => {
        console.log(request.body);
        response.status(200);
    })

    app.get("/text", (request, response) => {
        response.json({
            text: "Hooray! You can now see a hidden text!"
        })
    })

    await app.listen(3001);
    console.log("Client server runing on port 3001");
}