
const fs = require('fs');
const path = require('path');
const getAllFilesRecursively = require('./getAllFilesRecursively.cjs');


/**
 * Fetch the CSV files and parse all of them
 *
 * @param {string} dirPath - The path of the CSV file of the list to format its items files
 * @param {string} debug - Flag to enable console logs
*/
module.exports = function formatMetadataOfListItems(dirPath, debug=true){
  
  const csv_files = getAllFilesRecursively(dirPath, false).filter( e => path.parse(e).ext === ".csv" ); // Search for CSV files in the folder
  const errorLog = []
  
  for (file of csv_files){
    errorLog.push(...processCSVFile(file, debug)); // Process each found CSV file
  }
  
  return errorLog;
}


/**
 * Wraps the metadata of a MD file between '---'
 *
 * @param {string} csvPath - The path of the CSV file of the list to format its items files
 * @param {string} debug - Flag to enable console logs
*/
function processCSVFile(csvPath, debug=true) {

  const listPath = path.dirname(csvPath); // Get the folder path of the CSV file
  const errors = []

  // Read the contents of the CSV file and format it
  const csvContent = fs.readFileSync(csvPath, 'utf8').replaceAll(/["\r]/g, "")
  const rows = csvContent.split('\n');
  const data = rows.slice(1).map(row => row.split(','));

  for (let row of data) {

    // Get the Markdown file name and row content
    // Remove characters that notion doesnt allow in the exported names
    const mdBasename = row[0].trim().replaceAll(/:/g, "").replaceAll(/[\.\/\\\|]/g, " ");
    const mdName = mdBasename + '.md';

    // Get the full path of the Markdown file
    let mdPath = path.join(listPath, mdBasename);
    // Check if there are MD files that are not in a folder
    if (fs.existsSync(mdPath)){  // If a folder matched the `mdName`
      mdPath = path.join(mdPath, mdName);
    } else {  // If md name is at the same level
      mdPath += ".md";
    }


    // Check if the Markdown file path exists
    if (fs.existsSync(mdPath) && fs.statSync(mdPath).isFile()) {
      // Read the current content of the Markdown file
      let mdLines = fs.readFileSync(mdPath, 'utf8').split('\n');
      
      if (mdLines[0] !== "---" && mdLines.length > 2 && /.+: .+/.test(mdLines[2].trim())){
        
        // Store here the metadata extracted
        let metadaBuffer = "---\n";

        // Check if line 3 contains metadata, if so, read until the last metadata tag
        let j = 2;
        while (j < mdLines.length && /.+: .+/.test(mdLines[j].trim())) {
          // Remove white spaces from the metadata key
          metadaBuffer += mdLines[j].replaceAll(/\s(?=.*:)/g, "_") + "\n"
          mdLines[j] = null
          
          j++;
        }

        // Close the metadata section and write the updated content to the Markdown file
        metadaBuffer += "---\n";  // Clossing metadata wrapper
        mdLines= [metadaBuffer, ...mdLines];  // Appening to de file at the first line
        fs.writeFileSync(mdPath, mdLines.join('\n'));  // Write to the file

        if (debug) console.log(`[+] Metadata added in Markdown file: ${mdName}`);
         
      } else {
        if (debug) console.log(`[i] No changes in: ${mdName}`);
      }

    } else {
      if (debug) console.log(`[x] Markdown file "${mdName}" does not exist.`);
      // Log to error log file
      errors.push("File not found: " + mdPath)
    }
  }

  return errors;
}
