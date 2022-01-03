const express = require("express");

run().catch(error => console.log(error));

async function run(){
    const app = express();

    app.use(express.static("./"));

    await app.listen(3000);
    console.log("Client server runing on port 3000");
}