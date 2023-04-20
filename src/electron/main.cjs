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
        nameHash: undefined,
        moveToFolder: undefined,
        wikilinks: undefined,
        wikilinksComments: undefined,
        asterisks: undefined,
        callouts: undefined,
        missing: undefined,
        genListFiles: undefined,
        metadata: undefined,
    }

    console.log("Running scripts: ", options)
    ipcMain.send("on-scripts", 3)
    // result.nameHash = renameFilesAndFolders(options.exportPath, true)
    // result.missing = searchFilesByName(options.exportPath, "Untitled Database.md", true)
    // result.moveToFolder = moveFilesToMatchingFolder(options.exportPath, true)
    // result.wikilinks = urlFormatter(options.exportPath, true, true)
    // result.asterisks = stripAsterisks(options.exportPath, true)
    // result.callouts = calloutFormatter(options.exportPath, true)
    // result.genListFiles = listFormatter(options.exportPath, {prefix: "@LIST@__", sufix: "__"}, true)
    // result.metadata = metadataFormatter(options.exportPath, true)


    // Find missing databases 'Untitled Database.md'
    // results.missingReturn = searchFilesByName(options.exportPath, "Untitled Database.md", debug=true)


    console.log(results)

}