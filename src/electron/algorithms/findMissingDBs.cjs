const fs = require('fs');
const path = require('path');

/**
 * Function to search for files by name recursively in a given directory
 * and write the results to a file
 *
 * @param {string} directoryPath - The path of the directory to start the search from
 * @param {string} fileName - The name of the file to search for
 * @param {boolean} debug - (Optional) Flag to enable or disable debug mode, default is false
 */
module.exports = function searchFilesByName(directoryPath, fileName, debug = false) {
    const results = []; // Array to store matching file paths
  
    // Recursive function to search for files
    function searchRecursively(currentPath) {
      const files = fs.readdirSync(currentPath);
      files.forEach((file) => {
        const filePath = path.join(currentPath, file);
        const fileStat = fs.statSync(filePath);
  
        if (fileStat.isDirectory()) {
          // If it's a directory, search recursively
          searchRecursively(filePath);
        } else if (file === fileName) {
          // If the file matches the given name, add it to results
          if (debug) console.log("[+] Missing database found at: ", filePath)
          results.push(filePath);
        }
      });
    }
  
    // If directory exists, return list
    if (fs.existsSync(directoryPath)) {
      searchRecursively(directoryPath);
      return results
    }
    // If directory not exists, return null
    else return null  
  
  };
  