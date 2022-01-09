import React, {useState} from "react";
import NewWindow from "react-new-window";
import {GoogleLogin} from 'react-google-login';
import "./styles/App.css";

/*
  ? App function returns React application
 */
function App() {
  const [hiddenText, setHiddenText] = useState("Currently Hidden! Please log in to reveal text!"); //will hold value of hidden text
  const [open, setOpen] = useState(); //will open second window for authentication
  const [url, setURL] = useState(); //will make request to this url -> will be explained later


  //simple component for login
  const LogInComponent = () => {
    async function saveData(event){ 
      event.preventDefault();
      const username = event.target.fname.value; //passing values from form
      const password = event.target.pass.value;
  
      //making a post request to url -> exmp of URL: http://localhost:3002/authenticate/1214sdjaosdh1ohwqqwqe
      //last parameter in url represent cliend ID for this application
      const apiResponse = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(
          {username, password}
        )
      })
      //if authentication is successfull set token in a cookie -> access_token
      if(apiResponse.status === 200){
        const responseObject = await apiResponse.json();
        const cookie = require("cookie-cutter");
        cookie.set("access_token",responseObject.access_token);

        //automaticlly check if our server can decrypt encrypted token
        const apiStatus = await fetch("http://localhost:3001/text",{
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
        });
        //if decryption is successfull get hidden text, else show that text is still hidden
        if(apiStatus.status === 200){
          const apiResponse = await apiStatus.json();
          setHiddenText(apiResponse.text);
          setOpen(false);
        }
        else{
          setHiddenText("Still hidden");
          setOpen(false);
        }
      }     
    }
    return(
      <div>
        <div className={"title center"}>
          <h1>Prijavite se u aplikaciju</h1>
        </div>
        <form onSubmit={saveData}>
          <div className={"center"}>
            <label htmlFor="fname">Korisnicko ime: </label>
            <input type="text" id="fname" name="fname"></input>
          </div>
          <div className={"center"}>
            <label htmlFor="pass">Lozinka: </label>
            <input type="password" id="pass" name="pass"></input>
          </div>
          <div className={"center"}>
            <button className={"button"} type="submit">Prijava</button>
          </div>
        </form>
      </div>
    )
  }
  //this function will get and set url with our clientID
  async function getURL(){
    const apiResponse = await fetch("http://localhost:3001/client", {
      method: "GET",
      mode: "cors",
      headers: {"Content-Type": "application/json"}
    })
  
    if(apiResponse.status === 200)
    {
      const response = await apiResponse.json();
      setURL(response.authURL);
      setOpen(true);
    }
    else{
      console.log("No clientID");
    }
  }

  //Functions that will handle google oAuth login
  const responseGoogleSuccess = async (response) => {
    const apiResponse = await fetch("http://localhost:3001/google/text", {
      method: "GET",
      mode: "cors",
      headers: {"Content-Type": "application/json"}
    })
    const {text} = await apiResponse.json();
    setHiddenText(text);
  }
  const responseGoogleFailure = (response) => {
    setHiddenText("Currently Hidden! Please log in to reveal text!");
  }
  return (
    <>
    <div className={"center"}>
      <h1>OAuth/OAuth2: pregled, primjeri, ranjivosti, alternative, studije slučaja </h1>
    </div>
    <div className={"center"}>
      <h2>Projektni zadatak iz kolegija "Sigurnost informacijskih sustava"</h2>
    </div>
    <div className={"center"}>
      <h3>Izradili: Ivan Blažek, Iva Kozmač, Antonio Kunštek, Helena Potočki, Žan Žlender</h3>
    </div>
    <br></br>
    <div className={"container"}>
        <div className={"center"} style={{backgroundColor: "#ababab"}}>
          <p className={"hidden"}>{hiddenText}</p>
        </div>
        <hr></hr>
        <div className={"center"}>
            <button onClick={() => {
              getURL();
            }} className={"button"}>Oauth autorizacija</button>
        </div>
        {open && <NewWindow>
          <LogInComponent url={url}/>
          </NewWindow>}
        <div className={"center"}>
          <GoogleLogin
            clientId="184708501539-4vsu96fb1oe3etj9t7junre8b6cakp4g.apps.googleusercontent.com"
            buttonText="Google login"
            onSuccess={responseGoogleSuccess}
            onFailure={responseGoogleFailure}
            cookiePolicy={"single_host_origin"}
            className={"google"}
           />
        </div>
    </div>
    </>
  );
}
export default App;
