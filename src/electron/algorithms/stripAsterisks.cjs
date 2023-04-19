const fs = require('fs');
const path = require('path');



/**
 * Function to remove URL comments from Markdown files.
 * @param {string} folderPath - The path of the folder to process.
 * @param {boolean} debug - Option to enable debug mode.
 */
module.exports = function stripAsterisk(folderPath, debug) {

  const errorLog = []

  // Get a list of all files with .md extension in the folder and its subfolders
  const files = getFilesInFolder(folderPath, '.md');
  
  // Iterate through each file
  files.forEach(file => {
      try {
        // Read the content of the file
        const content = fs.readFileSync(file, 'utf8');

        // Apply the regular expression and update the content of the file
        const updatedContent = content.replace(/\*+\*\*([^\*]+)\*\*\*+/g, '**$1**');
        
        // Write the updated content to the file
        fs.writeFileSync(file, updatedContent);
        
        /\*\*\*+/g.test(updatedContent) && errorLog.push({file, error: "There are still arrays of '*' in the file..."})


        if (debug) {
          console.log(`[+] Regular expression applied in: ${file}`);
        }
      } catch (error) {
        // Log any errors that occur during the execution to the error log file
        errorLog.push({file: file, error: error.message})
      }
  });

    if (debug) console.log('[i] Markdown files processed successfully!');

    return errorLog;
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

