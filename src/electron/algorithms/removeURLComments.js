const fs = require('fs');
const path = require('path');

/**
 * Function to remove URL comments from Markdown files.
 * @param {string} folderPath - The path of the folder to process.
 * @param {string} errorLogPath - The path of the error log file.
 * @param {boolean} debug - Option to enable debug mode.
 */
module.exports = function removeURLComments(folderPath, errorLogPath, debug) {
  try {
    // Get a list of all files with .md extension in the folder and its subfolders
    const files = getFilesInFolder(folderPath, '.md');

    // Iterate through each file
    files.forEach(file => {
      // Read the content of the file
      const content = fs.readFileSync(file, 'utf8');

      // Apply the regular expression and update the content of the file
      const updatedContent = content.replace(/(!?\[\[.+\]\])\s*%%.*/g, '$1');

      // Write the updated content to the file
      fs.writeFileSync(file, updatedContent);

      if (debug) console.log(`Regular expression applied in: ${file}`);
    });

    if (debug) console.log('URL comments removed successfully from Markdown files!');
  } catch (error) {
    // Log any errors that occur during the execution to the error log file
    logError(error, errorLogPath);
  }
}

/**
 * Helper function to get a list of files with a specific extension in a folder and its subfolders.
 * @param {string} folderPath - The path of the folder to search.
 * @param {string} fileExtension - The file extension to filter by.
 * @returns {string[]} - An array of file paths.
 */
function getFilesInFolder(folderPath, fileExtension) {
  let files = [];

  // Read the contents of the folder
  const folderContents = fs.readdirSync(folderPath);

  // Iterate through each item in the folder
  folderContents.forEach(item => {
    const itemPath = path.join(folderPath, item);

    // Check if the item is a file with the specified extension
    if (fs.statSync(itemPath).isFile() && path.extname(itemPath) === fileExtension) {
      files.push(itemPath);
    }

    // If the item is a directory, recursively call the function to get files inside it
    if (fs.statSync(itemPath).isDirectory()) {
      files = files.concat(getFilesInFolder(itemPath, fileExtension));
    }
  });

  return files;
}

/**
 * Helper function to log errors to an error log file.
 * @param {Error} error - The error object.
 * @param {string} errorLogPath - The path of the error log file.
 */
function logError(error, errorLogPath) {
  const errorMessage = `[${new Date().toISOString()}] ${error.stack}\n`;

  fs.appendFileSync(errorLogPath, errorMessage);
}


