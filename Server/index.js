const cors = require("cors");
const express = require("express");

async function run(){
    const app = express();

    const authCodes = new Set();
    const accessToken = new Set();

    app.use(express.json());

    app.post("/code", (request, response) => {
        const authCode = new Array(10).fill(null).map(() => Math.floor(Math.random()*10)).join('');

        authCodes.add(authCode);
        response.redirect(`http://localhost:3000/oauth-callback.html?code=${authCode}`);
    });

    app.options("/token", cors(), (request, response) => {
        response.end();
    })

    app.options("/secure", cors(), (request, response) => {
        response.end();
    })


    app.post("/token", cors(), (request, response) => {
        if(authCodes.has(request.body.code)) {
            const token = new Array(50).fill(null).map(() => Math.floor(Math.random * 10)).join("");

            authCodes.delete(request.body.code);
            accessToken.add(token);
            response.json({
                "access_token" : token,
                "expires_in": 60 * 60 * 24
            })
        }
        else{
            response.status(400).json({"message": "Invalid auth token"});
        }
    })

    app.get("/secure", cors(), (request, response) => {
        const authorization = request.get("authorization");
        if(!accessToken.has(authorization)){
            return response.status(403).json({message : "Unauthorized"});
        }

        return response.json({answer: 42});
    })

    app.use(express.static("./"));

    await app.listen(3001);
    console.log("Listening on port 3001");
}