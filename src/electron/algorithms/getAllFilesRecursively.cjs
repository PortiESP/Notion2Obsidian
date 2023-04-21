const fs = require("fs")
const path = require("path")

/**
 * Function to get the list of files and directories recursively from a directory.
 * @param {string} directoryPath - The path of the base directory.
 * @param {boolean} dirs - Set this flag to include directories paths in the list
 */
module.exports = function getAllFilesRecursively(directoryPath, dirs=true) {
    let files = [];
    const elements = fs.readdirSync(directoryPath);
    elements.forEach(element => {
      const elementPath = path.join(directoryPath, element);
      const elementInfo = fs.statSync(elementPath);
      if (elementInfo.isDirectory()) {
        files = files.concat(getAllFilesRecursively(elementPath, dirs));
        dirs && files.push(elementPath);
      } else {
        files.push(elementPath);
      }
    });
    return files;
  }