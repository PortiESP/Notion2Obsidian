const fs = require('fs');
const path = require('path');
const getAllFilesRecursively = require('./getAllFilesRecursively.cjs')

/**
 * Move files to matching folder.
 *
 * @param {string} folderPath - The path of the folder to process.
 * @param {boolean} debug - Flag to enable/disable debug mode.
 */
module.exports = function moveFilesToMatchingFolder(folderPath, debug) {
    // Get all files in the specified folder and its subfolders
    const files = getAllFilesRecursively(folderPath, false);
    // Error log list
    const errorLog = []

    // Loop through each file
    files.forEach(filePath => {
        const parsedFile = path.parse(filePath)
        const fileBasename = parsedFile.base ; // File name and extension
        const destinationFolder = path.join(parsedFile.dir, parsedFile.name); // Get the destination folder path

        if (fs.existsSync(destinationFolder)) {
            try {
                const newFilePath = path.join(destinationFolder, fileBasename); // Get the new file path 
                fs.renameSync(filePath, newFilePath); // Move the file to the destination folder
                if (debug) {
                    console.log(`[+] File moved: ${filePath} --> ${newFilePath}`);
                }
            } catch (err) {
                if (debug) console.error(`[x] Error renaming file: ${filePath} - ${err.message}`);
                errorLog.push({file: filePath, error: err.message});
            }
        }
    });

    return errorLog;
}

