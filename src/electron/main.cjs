// Import modules
const {app, BrowserWindow, shell, ipcMain} = require('electron')
const path = require("path")
const fs = require("fs")

// On App Run
app.on("ready", ()=>{

    // Setup IPC
    setupIPC()

    // Create main window
    let mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    // Load window content
    // mainWindow.loadURL("http://localhost:6969")  // DEBUG
    mainWindow.loadFile(path.join(app.getAppPath(), "dist/index.html"))  // Production

    // Code
    console.log('This is logged in the main process (terminal)')
    console.log(app.getAppPath())

})


function setupIPC(){

    ipcMain.on("debug", (e, data) => console.log(data))
    ipcMain.on("openUrl", (e, data) => shell.openExternal(data))
    ipcMain.handle("checkPath", async (e, data) => await fs.existsSync(data))

}