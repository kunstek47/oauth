/*
* THIS IS CLIENT SERVER
*/


const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

run().catch(error => console.log(error));

async function run(){
    const app = express();
    var clientID = "";
    var secret = "";

    app.use(express.json());
    app.use(cors({origin: "http://localhost:3000", credentials: true}))
    app.use(cookieParser());

    app.all("/", (request, response) => {
        response.status(200).send("Hello from client server");
    })

    /*
    ! This route gets clientID and secret for our application, so we can successfully authorized user
    */
    app.get("/client", async (request, response) => {
        if(clientID == undefined || clientID == ""){
            axios({
                method: "GET",
                url: "http://localhost:3002/client",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    Accept: "application/json"
                  }
            }).then((res) => {
                clientID = res.data.clientID
                axios({
                    method: "GET",
                    url: `http://localhost:3002/secret/${clientID}`,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json",
                         Accept: "application/json"
                    }
                }).then((res2) => {
                    secret = res2.data.secret
                    console.log("Client ID: ", clientID);
                    console.log("Secret is: ", secret)
                    response.status(200).json({
                        clientID: clientID,
                        authURL: `http://localhost:3002/authenticate/${clientID}`
                    })
                }).catch((error) => {
                    throw(error);
                })
            }).catch((error) => {
                console.log(error);
                response.status(503).json({
                    message: "Server error"
                })
                
            })
        }
        else{
            response.status(200).json({
                clientID: clientID,
                authURL: `http://localhost:3002/authenticate/${clientID}` //url with we can authorize our user
            })
        }
    })

    /*
    ! Decrpyt if token is valid, if it is return hidden text
    */
    app.get("/text", (request, response) => {
        const accessToken = (request.cookies?.access_token);
        jwt.verify(accessToken, secret, (error, decoded) => {
            if(error){
                return response.status(503).json({
                    message: "Server error"
                });
            }
            if(decoded == undefined){
                return response.status(403).json({
                    message: "Forbidden access"
                })
            }

            console.log("Decoded token, user is: ", decoded);
            return response.status(200).json({
                text: "Hooray! You can now see a hidden text thanks to our Oauth server."
            });
        });
    })

    app.get("/google/text", (request, response) => {
            return response.status(200).json({
                text: "Hooray! You can now see a hidden text becaues your are logged in with google."
            });
        });

    await app.listen(3001);
    console.log("Client server runing on port 3001");
}