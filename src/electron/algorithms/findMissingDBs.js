const fs = require('fs');
const path = require('path');

/**
 * Function to search for files by name recursively in a given directory
 * and write the results to a file
 *
 * @param {string} directoryPath - The path of the directory to start the search from
 * @param {string} fileName - The name of the file to search for
 * @param {string} resultsFilePath - The path of the file where the results will be written
 * @param {boolean} debug - (Optional) Flag to enable or disable debug mode, default is false
 */
module.exports = function searchFilesByName(directoryPath, fileName, resultsFilePath, debug = false) {
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
          results.push(filePath);
        }
      });
    }
  
    searchRecursively(directoryPath);
  
    if (results.length > 0) {
      if (debug) {
        console.log(`Found ${results.length} files with the name "${fileName}":`);
        results.forEach((filePath) => {
          console.log(filePath);
        });
      }
  
      // Write results to file
      fs.writeFileSync(resultsFilePath, results.join('\n'));
      if (debug) console.log(`Results have been written to the file "${resultsFilePath}".`);
    } else {
      if (debug) console.log(`No files were found with the name "${fileName}".`);
    }
  };
  