const fs = require('fs');
const path = require('path');

/**
 * Process files recursively in a folder, applying a regular expression pattern to replace content.
 * @param {string} folderPath - The path of the folder to process.
 * @param {boolean} debug - Flag to enable/disable debug options.
*/
module.exports = function calloutConverter(folderPath, debug=true) {

  const errorLog = []

  // Get all files recursively in the folder with the specified extension
  const files = getFilesRecursively(folderPath, '.md');

  // Define RegEx pattern
  const regex = /<aside>\n*([\s\S]*?)<\/aside>/gm;
  
  // Loop through each file
  files.forEach(file => {
    // Read file content
    const content = fs.readFileSync(file, 'utf8');
    
    // Find all matches of the regular expression pattern in the content
    const matchResults = [...content.matchAll(regex)];
    
    if (matchResults.length > 0) {
      // If the pattern matches, replace the content
      let updatedContent = content;
      
      // Loop through each match
      matchResults.forEach(match => {
        // Extract the substring matched by the capturing group
        const grupo = match[1].replace(/\r?\n$/, '');
        
        // Replace line breaks with '> ' to format the substring as a blockquote
        const parsed = `> [!note]\n> ${grupo.replace(/\n/g, '\n>')}`;
        
        // Replace the original match with the parsed content in the updated content
        updatedContent = updatedContent.replace(match[0], parsed);
      });
      
      // Write the updated content back to the file
      fs.writeFileSync(file, updatedContent);

      /<\/?aside>/g.test(updatedContent) && errorLog.push({file, error: "There are still '<aside>' tags in the file, this can be because of callout that were inside other callouts"})
      
      // Print a message indicating the replacement was done
      if (debug) console.log(`[+] Replacement performed in: ${file}`);
    } else {
      // If no matches found, print a message indicating no matches
      if (debug) console.log(`[i] No matches found in: ${file}`);
    }
  });

  return errorLog;
}

/**
 * Get all files recursively in a folder with a specific extension.
 * @param {string} folderPath - The path of the folder to search in.
 * @param {string} extension - The file extension to filter by.
 * @returns {string[]} - An array of file paths.
 */
function getFilesRecursively(folderPath, extension) {
  let files = [];
  
  // Read the contents of the folder
  fs.readdirSync(folderPath).forEach(file => {
    const filePath = path.join(folderPath, file);
    const fileStat = fs.statSync(filePath);
    
    if (fileStat.isDirectory()) {
      // If it's a directory, recursively get files from it
      files = files.concat(getFilesRecursively(filePath, extension));
    } else if (path.extname(file) === extension) {
      // If it's a file with the specified extension, add it to the files array
      files.push(filePath);
    }
  });
  
  return files;
}

