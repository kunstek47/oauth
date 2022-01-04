const path = require("path");

const {app, BrowserWindow} = require("electron");
const isDev = require("electron-is-dev");


function createWindow(){
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadURL(
        isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "/app/build/index.html")}`
    );

    if(isDev){
        window.webContents.openDevTools({mode: "detach"});
    }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if(BrowserWindow.getAllWindows.length === 0){
        createWindow();
    }
})