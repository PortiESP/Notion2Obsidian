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
    ipcMain.on("run-scripts", runScripts)
}



function runScripts(e, options){

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
    
    
    e.sender.send("response-script-status", "Renaming files and folders...")
    result.nameHash = renameFilesAndFolders(options.exportPath, true)
    e.sender.send("response-script-status", true)
    
    e.sender.send("response-script-status", "Finding missing databases...")
    result.missing = searchFilesByName(options.exportPath, "Untitled Database.md", true)
    e.sender.send("response-script-status", true)
    
    e.sender.send("response-script-status", "Moving files to matching folder...")
    result.moveToFolder = moveFilesToMatchingFolder(options.exportPath, true)
    e.sender.send("response-script-status", true)
    
    e.sender.send("response-script-status", "Formating URLs as wikilinks format...")
    result.wikilinks = urlFormatter(options.exportPath, true, true)
    e.sender.send("response-script-status", true)
    
    e.sender.send("response-script-status", "Stripping asterisks from files content...")
    result.asterisks = stripAsterisks(options.exportPath, true)
    e.sender.send("response-script-status", true)
    
    e.sender.send("response-script-status", "Formatting callouts...")
    result.callouts = calloutFormatter(options.exportPath, true)
    e.sender.send("response-script-status", true)
    
    e.sender.send("response-script-status", "Generating list files...")
    result.genListFiles = listFormatter(options.exportPath, {prefix: "@LIST@__", sufix: "__"}, true)
    e.sender.send("response-script-status", true)
    
    e.sender.send("response-script-status", "Generating metadata in the list files...")
    result.metadata = metadataFormatter(options.exportPath, true)
    e.sender.send("response-script-status", true)

       
    e.sender.send("response-script-status", results)

}