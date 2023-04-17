const fs = require('fs');
const path = require('path');

/**
 * Function to process files with a specific extension recursively in a directory.
 * @param {string} baseFolderPath - The path of the base directory from where the search starts.
 * @param {string} errorLogPath - The path of the error log file.
 * @param {boolean} commentOriginal - Option to enable/disable the Obsidian MD comment with the original URL of the resource.
 * @param {boolean} debug - Option to enable/disable debug mode.
 */
module.exports = function urlFormatter(baseFolderPath, errorLogPath, commentOriginal=true, debug = false) {
  try {
    // Get the list of files recursively in the base directory
    const files = getAllFilesRecursive(baseFolderPath);

    // Filter files that have the target extension
    const targetFiles = files.filter(file => path.extname(file) === ".md");

    // Process each target file
    targetFiles.forEach(file => {
      if (debug) {
        console.log(`Processing file: ${file}`);
      }

      // Read the content of the file
      const content = fs.readFileSync(file, 'utf8');

      // Perform pattern replacement in the file content
      const newContent = content.replace(/(!?)\[(.+?)\]\(([^)]+)\)/g, `$1[[$2]]${commentOriginal ? " %% $3" : ""}`);

      // Write the new content to the file
      fs.writeFileSync(file, newContent, 'utf8');
    });

    console.log('Process completed.');
  } catch (error) {
    // Log any error occurred during script execution to the error log file
    fs.appendFileSync(errorLogPath, `[${new Date()}] ${error}\n`);
    console.error('An error occurred during processing. Please check the error log for details.');
  }
}

/**
 * Function to get the list of files recursively in a directory.
 * @param {string} directoryPath - The path of the base directory.
 * @returns {string[]} - An array with the full paths of the found files.
 */
function getAllFilesRecursive(directoryPath) {
  let files = [];
  const elements = fs.readdirSync(directoryPath);
  elements.forEach(element => {
    const elementPath = path.join(directoryPath, element);
    const elementInfo = fs.statSync(elementPath);
    if (elementInfo.isDirectory()) {
      files = files.concat(getAllFilesRecursive(elementPath));
    } else {
      files.push(elementPath);
    }
  });
  return files;
}


