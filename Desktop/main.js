const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");
const path = require("path");


/*
? This function creates window based on html file that we created inside index.html page 
*/
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    win.loadFile("index.html");


    /*
    ?   This function enables dark mode theme inside our app depending on styles.css file that will be inside our index.html and also it needs to be loaded in preload script.
    */
    ipcMain.handle("dark-mode:toggle", () => {
        if(nativeTheme.shouldUseDarkColors){
            nativeTheme.themeSource = "light";
        }
        else{
            nativeTheme.themeSource = "dark";
        }
        return nativeTheme.shouldUseDarkColors;
    });

    ipcMain.handle("dark-mode:system", () => {
        nativeTheme.themeSource = "system";
    });
}


app.whenReady().then(() => {
    createWindow();
    
    app.on("activate", () => {
        if(BrowserWindow.getAllWindows().length === 0) createWindow();
    })

    /*
    ? INFO: This code creates new BrowserWindow inside our application. Basiclly it runs website inside our desktop application.
    const win = new BrowserWindow({width: 800, height: 1500});
    win.loadURL("https://github.com");
    */
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") app.quit();
});
