// Import modules
const {app, BrowserWindow, shell, ipcMain} = require('electron')
const path = require("path")
const fs = require("fs")
// Algorithms
const searchFilesByName = require("./algorithms/findMissingDBs.cjs")


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
    ipcMain.on("open-url", (e, data) => shell.openExternal(data))
    ipcMain.handle("check-path", async (e, data) => await fs.existsSync(data))
    ipcMain.on("run-scripts", (e, data) => runScripts(data))
}



function runScripts(options){

    // Returned data
    const results = {
        nameHashReturn: null,
        moveToFolderReturn: null,
        missingReturn: null,
        createdListFiles: null,
    }

    // Find missing databases 'Untitled Database.md'
    // results.missingReturn = searchFilesByName(options.exportPath, "Untitled Database.md", debug=true)
    results.missingReturn = searchFilesByName("C:/Users/Porti/Desktop/CONVERT/Export-9f787dd1-7f28-4ead-9fa1-421bbef21fbf/", "Untitled Database.md", debug=true)


    console.log(results)

}