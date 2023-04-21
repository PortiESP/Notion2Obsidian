const fs = require('fs');
const path = require('path');
const getAllFilesRecursively = require('./getAllFilesRecursively.cjs')



/**
 * Function to remove URL comments from Markdown files.
 * @param {string} folderPath - The path of the folder to process.
 * @param {boolean} debug - Option to enable debug mode.
 */
module.exports = function stripAsterisk(folderPath, debug) {

  const errorLog = []

  // Get a list of all files in the path 
  const files = getAllFilesRecursively(folderPath, false);
  // Filter by extension
  const filteredList = files.filter(file => path.parse(file).ext === ".md")
  
  // Iterate through each file
  filteredList.forEach(file => {
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
  




