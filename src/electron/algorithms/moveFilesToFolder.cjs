const fs = require('fs');
const path = require('path');

/**
 * Move files to matching folder.
 *
 * @param {string} folderPath - The path of the folder to process.
 * @param {boolean} debug - Flag to enable/disable debug mode.
 */
module.exports = function moveFilesToMatchingFolder(folderPath, debug) {
    // Get all files in the specified folder and its subfolders
    const files = getAllFiles(folderPath);
    // Error log list
    const errorLog = []

    // Loop through each file
    files.forEach(file => {
        const fileNameWithoutExt = file.name.split('.').slice(0, -1).join(); // Get the file name without extension
        const newFileName = `${fileNameWithoutExt}${path.extname(file.name)}`; // Generate a new file name with the same name and extension
        const destinationFolder = path.join(file.parent, fileNameWithoutExt); // Get the destination folder path

        if (fs.existsSync(destinationFolder)) {
            try {
                const newFilePath = path.join(destinationFolder, newFileName); // Get the new file path
                fs.renameSync(file.path, newFilePath); // Move the file to the destination folder
                if (debug) {
                    console.log(`[+] File moved: ${file.path} --> ${newFilePath}`);
                }
            } catch (err) {
                if (debug) console.error(`[x] Error renaming file: ${file.path} - ${err.message}`);
                errorLog.push({file: file.path, error: err.message});
            }
        }
    });

    return errorLog;
}

/**
 * Recursively get all files in a directory and its subdirectories.
 *
 * @param {string} dirPath - The path of the directory to scan.
 * @param {Array} arrayOfFiles - Array to store the files.
 * @returns {Array} - Array of file objects with name, path, and parent properties.
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            arrayOfFiles.push({
                name: file,
                path: filePath,
                parent: dirPath
            });
        } else if (stats.isDirectory()) {
            getAllFiles(filePath, arrayOfFiles);
        }
    });

    return arrayOfFiles;
}

