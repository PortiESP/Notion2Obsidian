const fs = require('fs');
const path = require('path');
const getAllFilesRecursively = require('./getAllFilesRecursively.cjs');

/**
 * Process files recursively in a folder, applying a regular expression pattern to replace content.
 * @param {string} folderPath - The path of the folder to process.
 * @param {boolean} debug - Flag to enable/disable debug options.
*/
module.exports = function calloutConverter(folderPath, debug=true) {

  const errorLog = []

  // Get all files recursively in the folder with the specified extension
  const files = getAllFilesRecursively(folderPath).filter( filePath => path.parse(filePath).ext === ".md");
  
  // Loop through each file
  files.forEach(filePath => {

    try{
      // Read file content
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Find all matches of the regular expression pattern in the content
      const updatedContent = calloutReplacingAlgorithm(content.replace("\r", ""))
      
      // Check algorithm result: null=No matches found in this file
      if (updatedContent === null) {
        if (debug) console.log(`[i] No changes made at: ${filePath}`);
      } else {
        fs.writeFileSync(filePath, updatedContent);
        if (debug) console.log(`[+] Replacement performed in: ${filePath}`);
      }
      
      // Error check
      /<\/?aside>/g.test(updatedContent) && errorLog.push({file: filePath, error: "There are still '<aside>' tags in the file, this can be because of callout that were inside other callouts"})
      
    } catch(err){
      errorLog.push({file: filePath, error: err})
    }
  });
  
  return errorLog;
}


/**
 * 
 * @param {string} content - String where we want to perform the algorithm
 * 
 */
function calloutReplacingAlgorithm(content){

  // Append to each tag with its depth level
  let depth = 0
  let updatedContent = content.replaceAll(/<\/?aside>/gm, (match) => {
    if (match === "<aside>") {
      depth += 1
      return `<aside${depth}>` 
    }
    else {
      depth -= 1
      return `</aside${depth+1}>` 
    } 
  })
  
  // Replace tags until no one is left
  while (/<aside(\d+)>\n?([\s\S]+?)\n?<\/aside\1>/gm.test(updatedContent)){
    updatedContent = updatedContent.replaceAll(/<aside(\d+)>\n?([\s\S]+?)\n?<\/aside\1>/gm, (match, g1, g2) => {
      const parsed = `> [!note]\n> ${g2.replaceAll(/\n/g, '\n> ')}`;
      return parsed
    })
  }
  

  return updatedContent
  
}
