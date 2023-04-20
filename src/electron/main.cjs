// Import modules
const {app, BrowserWindow, shell, ipcMain, dialog} = require('electron')
const path = require("path")
const fs = require("fs")
// Algorithms
const renameFilesAndFolders = require("./algorithms/renameFilesAndDirs.cjs")
const moveFilesToMatchingFolder = require("./algorithms/moveFilesToFolder.cjs")
const searchFilesByName = require("./algorithms/findMissingDBs.cjs")
const urlFormatter = require("./algorithms/urlFormatter.cjs")
const stripAsterisks = require("./algorithms/stripAsterisks.cjs")
const calloutFormatter = require("./algorithms/calloutFormatter.cjs")
const listFormatter = require("./algorithms/listFormatter.cjs")
const metadataFormatter = require("./algorithms/metadataFormatter.cjs")


// ============================================================================[ EVENTS ]===========================================================>
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


// Quit when all windows are closed
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
});




// ============================================================================[ FUNCTIONS ]===========================================================>
function setupIPC(){
    ipcMain.on("debug", (e, data) => console.log(data))
    ipcMain.on("open-url", (e, data) => shell.openExternal(data))
    ipcMain.handle("check-path", async (e, data) => {
        const ret = await fs.existsSync(data)
        await console.log("Checking path [data] = ", ret)
        return ret
    })
    ipcMain.on("run-scripts", runScripts)
    ipcMain.on("save-results", saveResults)
    ipcMain.on("exit", ()=> app.exit())
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
    
    if (options.nameHash){
        e.sender.send("response-script-status", "Renaming files and folders...")
        results.nameHash = renameFilesAndFolders(options.exportPath, true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.missing){
        e.sender.send("response-script-status", "Finding missing databases...")
        results.missing = searchFilesByName(options.exportPath, "Untitled Database.md", true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.moveToFolder){
        e.sender.send("response-script-status", "Moving files to matching folder...")
        results.moveToFolder = moveFilesToMatchingFolder(options.exportPath, true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.wikilinks){
        e.sender.send("response-script-status", "Formating URLs as wikilinks format...")
        results.wikilinks = urlFormatter(options.exportPath, true, {prefix: options.listNamePrefix, sufix: options.listNameSufix}, true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.asterisks){
        e.sender.send("response-script-status", "Stripping asterisks from files content...")
        results.asterisks = stripAsterisks(options.exportPath, true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.callouts){
        e.sender.send("response-script-status", "Formatting callouts...")
        results.callouts = calloutFormatter(options.exportPath, true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.genListFiles){
        e.sender.send("response-script-status", "Generating list files...")
        results.genListFiles = listFormatter(options.exportPath, {prefix: options.listNamePrefix, sufix: options.listNameSufix}, true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.metadata){
        e.sender.send("response-script-status", "Generating metadata in the list files...")
        results.metadata = metadataFormatter(options.exportPath, true)
        e.sender.send("response-script-status", true)
    }

       
    e.sender.send("response-script-status", results)

}



function saveResults(e, results){
    dialog.showSaveDialog({
        title: 'Save File',
        buttonLabel: 'Save',
        defaultPath: '~/Documents/',
        filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
        ]
    }).then(res => {
        if (!res.canceled) {
            const filePath = res.filePath;
            console.log("Saving results at: ", filePath)

            const content = JSON.stringify(results, null, 4)
            console.log("Saving JSON:", content)
            fs.writeFileSync(filePath, content)

            // Use the selected file path to save the file
        }
    }).catch(err => {
        console.log(err);
    });
}