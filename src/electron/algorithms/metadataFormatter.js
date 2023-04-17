const fs = require('fs');
const path = require('path');


/**
 * Fetch the CSV files and parse all of them
 *
 * @param {string} csvPath - The path of the CSV file of the list to format its items files
 * @param {string} errorLogPath - The path where to output the errors
 */
module.exports = function formatMetadataOfListItems(basename, errorLogPath, debug=true){

  const csv_files = searchFilesByExtension(basename, ".csv"); // Search for CSV files in the folder

  for (file of csv_files){
    processCSVFile(file, errorLogPath); // Process each found CSV file
  }

}


/**
 * Wraps the metadata of a MD file between '---'
 *
 * @param {string} csvPath - The path of the CSV file of the list to format its items files
 * @param {string} errorLogPath - The path where to output the errors
 */
function processCSVFile(csvPath, errorLogPath) {

  const listPath = path.dirname(csvPath); // Get the folder path of the CSV file

  // Read the contents of the CSV file and format it
  const csvContent = fs.readFileSync(csvPath, 'utf8').replaceAll(/["\r]/g, "").replaceAll(/[\/\\]/g, "|");
  const rows = csvContent.split('\n');
  const data = rows.slice(1).map(row => row.split(','));

  for (let row of data) {

    // Get the Markdown file name and row content
    const mdName = row[0].trim() + '.md';

    // Get the full path of the Markdown file
    let mdPath = path.join(listPath, row[0]);
    // Check if there are MD files that are not in a folder
    if (!fs.existsSync(mdPath)) mdPath = path.join(listPath, mdName);

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

        if (debug) console.log(`Metadata added in Markdown file: ${mdName}`);
         
      } else {
        if (debug) console.log(`No changes in: ${mdName}`);
      }

    } else {
      if (debug) console.log(`Markdown file ${mdName} does not exist. Recording in the log file.`);
      // Log to error log file
      fs.appendFileSync(errorLogPath, `[File not found]: ${mdPath}\n`);
    }
  }

  if (debug) console.log('Process completed successfully!');
}

/**
 * Function to search for files by name recursively in a given directory
 * and write the results to a file
 *
 * @param {string} directoryPath - The path of the directory to start the search from
 * @param {string} extension - The extension of the file to search for
 */
function searchFilesByExtension(directoryPath, extension) {
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
      } else if (path.extname(file) === extension) {
        // If the file matches the given name, add it to results
        results.push(filePath);
      }
    });
  }

  searchRecursively(directoryPath);

  return results;
};