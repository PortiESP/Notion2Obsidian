
const path = require('path');
const getAllFilesRecursively = require('./getAllFilesRecursively.cjs');

/**
 * Function to search for files by name recursively in a given directory and return the list of paths that matched the fileName
 *
 * @param {string} directoryPath - The path of the directory to start the search from
 * @param {string} fileName - The name of the file to search for
 * @param {boolean} debug - (Optional) Flag to enable or disable debug mode, default is false
 */
module.exports = function searchFilesByName(directoryPath, fileName, debug = false) {
  
  // Get All files is the directory
  const pasthsList = getAllFilesRecursively(directoryPath, false)
  
  // Filter the list to find the matching files
  return pasthsList.filter( filePath => {
    const parsedPath = path.parse(filePath)
    const isAMatch = parsedPath.base === fileName
    if (debug && isAMatch) console.log("[+] Match found at: ", filePath)   
    return isAMatch    
  })
  
};
  