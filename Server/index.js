const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const level = require("level");

const db = level("./db", {valueEncoding: "json"})
const user = {
    username: "test",
    password: "test",
}

function createRandom32String(){
    var secret = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuwxyz1234567890";
    for (var i=0; i<32; i++){
        secret += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return secret;
}

/*
! This function creates clientID and store it in our key-value database
*/
function createAndSaveCliendID(){
    var clientID = createRandom32String();
    db.put(clientID, createRandom32String(), (error) => {
        if(error){
            throw error;
        }
    })
    return clientID;
}

run();

async function run(){
    const app = express();
    /*
    !   This function creates secret, we send this secret to client server so we can decrypt our token later
    ?   Function returns secret as string
    */
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({origin: ["http://localhost:3000", "http://localhost:3001"]}))


     /*
      ! Path that just sends description of server
      */
    app.all("/", (request, response) => {
        response.send("Hello I am OAuth server!");
    }); 

    app.get("/client", (request, response) => {
        try {
            var clientID = createAndSaveCliendID();
            response.status(200).json({
                clientID: clientID
            })
        } catch (error) {
            response.status(503).json(
                {
                    message: "Server error"
                }
            )
        }
    })

    /*
    /*
    !   This path will get public secret key for specific application
    */
   app.get("/secret/:clientid", (request, response) => {
       let secretKey = "";
       try {
        db.get(request.params.clientid, (error, value) => {
            if(error){
                throw error;
            }
            secretKey = value;
            response.status(200).json({
                secret: secretKey
            })
        })
       } catch (error) {
           response.status(503).json({
               message: "Server error"
           })
       }
   })

    /*
    ! This path will generate token and write it in cookie
    */
    app.post("/authenticate/:clientid", (request, response) => {
        let secretKey = "";
        let cookie = request?.cookies?.token;
        try {
            db.get(request.params.clientid, (error, value) => {
                if(error){
                    throw error;
                }
                secretKey = value;
                if(request.body.username == user.username && request.body.password == user.password){
                    console.log("I am here: ", secretKey);
                    let jsonwebtoken = jwt.sign(user, secretKey, {expiresIn: 60*60});
                    console.log("Token is: ", jsonwebtoken);
                    if(cookie === undefined)
                    {
                       return response.status(200).json(
                           {
                               message: "Authentication successfull",
                               access_token: jsonwebtoken
                           }
                       );
                    }
                 }
                 else{
                     return response.status(400).json({
                         message: "Authentication failed"
                     });
                 }
            })
            
        } catch (error) {
            console.log(error);
            return response.status(503).json({
                message: "Server error"
            })
        }
    })



    await app.listen(3002);
    console.log("Listening on port 3002");
}






 /*const authCodes = new Set();
    const accessToken = new Set();

    app.use(express.json());

    app.all("/", (request, response) => {
        response.status(200).send("Hello world");
    })

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
    })*/