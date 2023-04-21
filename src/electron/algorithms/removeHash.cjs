const fs = require('fs'); // Import the 'fs' module for file system operations
const path = require('path'); // Import the 'path' module for path-related operations
const getAllFilesRecursively = require('./getAllFilesRecursively.cjs'); // Import the 'path' module for path-related operations

// 
/**
 * Function to rename files and folders
 * @param {string} folderPath - Path of the folder to process
 * @param {boolean} debug - Debug option to print debug messages
 */
module.exports = function removeHash(dirPath, debug = false) {

    let errorLog = [];

    // Get the list of all the files and dirs on the path given
    const filesAndDirs = getAllFilesRecursively(dirPath, true)

    filesAndDirs.forEach( path => {
    
        // Rename files and folders
        // Use a regular expression to match file names with a pattern of word characters, spaces, parentheses, and a 32-character string followed by '.md' or '.csv'
        // Replace the matching pattern with the word characters, spaces, and parentheses only, and keep the '.md' or '.csv' extension if present
        let newPath = path.replace(/([\w\s\(\)]+) \w{32}(\.md|\.csv)?$/i, '$1$2'); // Note: Added 'let' to declare 'newPath' as a variable
        
        // Check if the old name and new name are different, indicating that the entry needs to be renamed
        if (path !== newPath) {
            try {
                fs.renameSync(path, newPath); // Rename the entry using the new name
                if (debug) console.log(`[-] Original element: ${path}`); // If in debug mode, log the original name
                if (debug) console.log(`[+] Renamed element: ${newPath}`); // If in debug mode, log the new name after renaming
            } catch (err) {
                if (debug) console.error(`[x] Error renaming element: ${err.message}`); // If in debug mode, log the error message
                errorLog.push({file: path, errorMsg: err.message}); // Append the error message to the error log file
            }
        } else {
            if (debug) console.log(`[i] Original element: ${path} does not require renaming.`); // If in debug mode, log that the entry does not require renaming
        }
    })


    // Make a copy of the list, prevent it form loosing it when the function ends
    return errorLog;
}
