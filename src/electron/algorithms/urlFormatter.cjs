const fs = require('fs');
const path = require('path');

/**
 * Function to process files with a specific extension recursively in a directory.
 * @param {string} baseFolderPath - The path of the base directory from where the search starts.
 * @param {boolean} commentOriginal - Option to enable/disable the Obsidian MD comment with the original URL of the resource.
 * @param {object} nameDecoration - Handles the possible prefix or sufix that may have the file
 *   @param {string} sufix - Stores the prefix, if the list have it
 *   @param {string} prefix - Stores the sufix, if the list have it
 * @param {boolean} debug - Option to enable/disable debug mode.
 */
module.exports = function urlFormatter(baseFolderPath, commentOriginal=true, nameDecoration={prefix:"", sufix:""}, debug = false) {

  const errorLog = []

  // Get the list of files recursively in the base directory
  const files = getAllFilesRecursive(baseFolderPath);
  
  // Filter files that have the target extension
  const targetFiles = files.filter(file => path.extname(file) === ".md");
  
  // Process each target file
  targetFiles.forEach(file => {
    try {
      if (debug) console.log(`[i] Processing file: ${file}`);

        // Read the content of the file
        const content = fs.readFileSync(file, 'utf8');

        // Perform pattern replacement in the file content
        const newContent = content.replace(/(!?)\[(.+?)\]\(([^)]+\.(.+))\)/g, (match, g1, g2, g3, g4)=>{

          let {prefix, sufix} = nameDecoration
          prefix = prefix?prefix:""
          sufix = sufix?sufix:""
          const filename = `${prefix}${g2}${sufix}.md`
          const isList = targetFiles.includes(`${path.dirname(file)}\\${filename}`) || targetFiles.includes(`${path.dirname(file)}\\${g2}\\${filename}`)
          const comment = commentOriginal ? ` %% ${g3}` : ""
          const preview = (isList || g1==="!") ? "!" : ""

          return `${preview}[[${isList?filename:g2}]]${comment}`
        })


        // Write the new content to the file
        fs.writeFileSync(file, newContent, 'utf8');
    } catch (error) {
      // Log any error occurred during script execution to the error log file
      errorLog.push({file: error.path, error: error.message});
      if (debug) console.error('[x] An error occurred during processing. Please check the error log for details.');
    }
  });

    if (debug) console.log('[i] Process completed.');

  return errorLog
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


