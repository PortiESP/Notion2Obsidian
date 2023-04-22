// Import modules
const {app, BrowserWindow, shell, ipcMain, dialog} = require('electron')
const path = require("path")
const fs = require("fs")
// Algorithms
const removeHash = require("./algorithms/removeHash.cjs")
const moveFilesToMatchingFolder = require("./algorithms/moveFilesToMatchingFolder.cjs")
const searchFilesByName = require("./algorithms/searchFilesByName.cjs")
const urlFormatter = require("./algorithms/urlFormatter.cjs")
const stripAsterisks = require("./algorithms/stripAsterisks.cjs")
const calloutFormatter = require("./algorithms/calloutFormatter.cjs")
const generateListFiles = require("./algorithms/generateListFiles.cjs")
const metadataFormatter = require("./algorithms/metadataFormatter.cjs")


// ============================================================================[ EVENTS ]===========================================================>
// On App Run
app.on("ready", ()=>{

    // Setup IPC
    setupIPC()

    // Create main window
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        icon: "./src/render/assets/icon.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            // devTools: false,
            
        },
    })

    // Window settings
    // mainWindow.setMenu(null)

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
        removeHashLogs: { label:"Errors removing hash from files", data: undefined},
        moveToFolderLogs: { label:"Errors moving files to matching folders", data: undefined},
        findMissingDBsLogs: { label:"Missing Databases", data: undefined},
        urlFormatterLogs: { label:"Errors formatting URLs", data: undefined},
        stripAsterisksLogs: { label:"Asterisk chains found in the file (bolds)", data: undefined},
        calloutsFormatterLogs: { label:"Aside tags found in the file (callouts)", data: undefined},
        genListFilesLogs: { label:"Error generating list files from SVGs", data: undefined},
        metadataFormatterLogs: { label:"Failed to format metadata", data: undefined},
    }

    console.log("Running scripts: ", options)

    /* !!! The order in which the scripts are runned matters, some scripts assume that others where run before them */
    
    if (options.removeHash){
        e.sender.send("response-script-status", "Renaming files and folders...")
        results.removeHashLogs.data = removeHash(options.exportPath, true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.findMissingDBs){
        e.sender.send("response-script-status", "Finding missing databases...")
        results.findMissingDBsLogs.data = searchFilesByName(options.exportPath, "Untitled Database.md", true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.moveToFolder){
        e.sender.send("response-script-status", "Moving files to matching folder...")
        results.moveToFolderLogs.data = moveFilesToMatchingFolder(options.exportPath, true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.stripAsterisks){
        e.sender.send("response-script-status", "Stripping asterisks from files content...")
        results.stripAsterisksLogs.data = stripAsterisks(options.exportPath, true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.calloutsFormatter){
        e.sender.send("response-script-status", "Formatting callouts...")
        results.calloutsFormatterLogs.data = calloutFormatter(options.exportPath, true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.genListFiles){
        e.sender.send("response-script-status", "Generating list files...")
        results.genListFilesLogs.data = generateListFiles(options.exportPath, {prefix: options.listNamePrefix, sufix: options.listNameSufix}, true)
        e.sender.send("response-script-status", true)
    }
    
    if (options.metadataFormatter){
        e.sender.send("response-script-status", "Generating metadata in the list files...")
        results.metadataFormatterLogs.data = metadataFormatter(options.exportPath, true)
        e.sender.send("response-script-status", true)
    }

    if (options.urlFormatter){
        e.sender.send("response-script-status", "Formating URLs as wikilinks format...")
        results.urlFormatterLogs.data = urlFormatter(options.exportPath, true, {prefix: options.listNamePrefix, sufix: options.listNameSufix}, true)
        e.sender.send("response-script-status", true)
    }
    

    Object.keys(results).forEach((key) => {
        if (results[key].data === undefined) {
          delete results[key];
        }
    });

    e.sender.send("response-script-status", results)
    
}



function saveResults(e, results){
    dialog.showSaveDialog({
        title: 'Save File',
        buttonLabel: 'Save',
        defaultPath: '~/Documents/',
        filters: [
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