const fs = require('fs'); // Import the 'fs' module for file system operations
const path = require('path'); // Import the 'path' module for path-related operations

// 
/**
 * Function to rename files and folders
 * @param {string} folderPath - Path of the folder to process
 * @param {string} errorLogPath - Path of the error log file
 * @param {boolean} debug - Debug option to print debug messages
 */
module.exports = function renameFilesAndFolders(dirPath, errorLogFile, debug = false) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true }); // Read the entries in the specified directory synchronously, with file type information

  entries.forEach(entry => { // Loop through each entry in the directory
    const entryPath = path.join(dirPath, entry.name); // Get the full path of the entry by joining the directory path and the entry name
    const oldName = entryPath; // Store the original name for comparison

    // Rename files and folders
    // Use a regular expression to match file names with a pattern of word characters, spaces, parentheses, and a 32-character string followed by '.md' or '.csv'
    // Replace the matching pattern with the word characters, spaces, and parentheses only, and keep the '.md' or '.csv' extension if present
    let newName = entryPath.replace(/([\w\s\(\)]+) \w{32}(\.md|\.csv)?$/i, '$1$2'); // Note: Added 'let' to declare 'newName' as a variable
    
    // Check if the old name and new name are different, indicating that the entry needs to be renamed
    if (oldName !== newName) {
        try {
            fs.renameSync(oldName, newName); // Rename the entry using the new name
            if (debug) console.log(`Original element: ${oldName}`); // If in debug mode, log the original name
            if (debug) console.log(`Renamed element: ${newName}`); // If in debug mode, log the new name after renaming
        } catch (err) {
            const errorMessage = err.message; // Get the error message
            if (debug) console.error(`Error renaming element: ${errorMessage}`); // If in debug mode, log the error message
            fs.appendFileSync(errorLogFile, `Original element: ${oldName} - Error: ${errorMessage}\n`); // Append the error message to the error log file
        }
    } else {
        if (debug) console.log(`Original element: ${oldName} does not require renaming.`); // If in debug mode, log that the entry does not require renaming
    }

    // If it's a folder, make a recursive call to the function to process subfolders with the new name
    if (entry.isDirectory()) {
      renameFilesAndFolders(newName, errorLogFile, debug);
    }
  });
}
