import React, {useState} from "react";
import NewWindow from "react-new-window";
import {GoogleLogin} from 'react-google-login';
import "./styles/App.css";



const LogInComponent = () => {
  async function saveData(event){ 
    event.preventDefault();
    const username = event.target.fname.value;
    const password = event.target.pass.value;

    const apiResponse = await fetch("http://localhost:3001/login", {
      method: "POST",
      mode: "cors",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(
        {username, password}
      )
    })

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

function App() {
  const [hiddenText, setHiddenText] = useState("Currently Hidden! Please log in to reveal text!");
  const [open, setOpen] = useState();
  const responseGoogleSuccess = async (response) => {
    const apiResponse = await fetch("http://localhost:3001/text", {
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
              setOpen(true)
            }} className={"button"}>Oauth autorizacija</button>
        </div>
        {open && <NewWindow>
          <LogInComponent />
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
