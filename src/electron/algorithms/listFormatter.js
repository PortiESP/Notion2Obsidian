const fs = require('fs');
const path = require('path');

/**
 * Function to parse SVG files from Notion export and format as a DataviewJS block un a new MD file where a list is created 
 * with the data from the SVG
 *
 * @param {string} directoryPath - The path of the directory to start the search from
 * @param {string} errorLogPath - The file path where the error log should be written. Any errors that occur during execution will be appended to this file.
 * @param {Object} nameFormat - An optional object that specifies the format of the output MD file names. It has two properties:
 *   @param {string} nameFormat.prefix - An optional prefix string to be added to the base name of the CSV file when creating the MD file. Default is an empty string.
 *   @param {string} nameFormat.sufix - An optional suffix string to be added to the base name of the CSV file when creating the MD file. Default is an empty string.
 * @param {boolean} debug - An optional boolean flag that determines whether to enable debug mode or not. When set to true, debug information will be printed to the console. Default is false.
 *
 */
module.exports = function processCSVFiles(directoryPath, errorLogPath, nameFormat={prefix:"", sufix:""}, debug = false) {
  // Array to store CSV files found
  const csvFiles = searchFilesByExtension(directoryPath, ".csv");

  // Loop through the found CSV files
  for (const csvFile of csvFiles) {
    try {
      // Get the base name of the CSV file without extension
      const baseName = path.basename(csvFile, path.extname(csvFile));

      // Read the CSV file and get the headers
      const csvData = fs.readFileSync(csvFile, 'utf8').replaceAll("\r", "");
      let itemsList = csvData.split("\n")  //Parse the csv
      const headers = itemsList[0].split(",");  // Extract the headers
      itemsList = itemsList.slice(1).map(e => e.split(",")[0])  // Extract first colum of each row except the headers

      // Create the MD file with the same name but with .md extension
      const mdFile = path.join(path.dirname(csvFile), `${nameFormat.prefix ?? ""}${baseName}${nameFormat.sufix ?? ""}.md`);

      // Write the desired content to the MD file
      const headersStr = "[" + headers.map(colName => '"' + colName + '"').join(", ") + "]"
      const itemsStr = ("[" + itemsList.map(metatagName => '"' + metatagName.replaceAll('"', "").trim() + '"').join(", ") + "]")
      const metatagsStr = headers.slice(1).map(metaTag => 'e.' + metaTag).join(", ")
      const content = `\`\`\`dataviewjs
      let pages = dv.pages("")
      let headers = ${headersStr.replaceAll("\r", "")}
      let items = ${itemsStr.replaceAll("\r", "")}
      
      dv.table(headers, pages
        .filter(e => (e.file.path === dv.current().file.folder + "/" + e.file.name + "/" + e.file.name + "." + e.file.ext) || (e.file.path === dv.current().file.folder + "/" + e.file.name + "." + e.file.ext && e.file.path !== dv.current().file.path))
        // Information of each result
        .map(e => [e.file.link, ${metatagsStr.replaceAll("\r", "").replaceAll(" ", "_")}]))\n\`\`\``.replaceAll("\r", "");

      fs.writeFileSync(mdFile, content, 'utf8');
    } catch (err) {
      // Log any errors that occur during execution to the error log file
      fs.appendFileSync(errorLogPath, `Error: ${err}\n`, 'utf8');
      if (debug) console.error(err);
    }
  }

  if (debug) console.log('MD files created successfully!');
}

/**
 * Function to search for files by name recursively in a given directory
 * and write the results to a file
 *
 * @param {string} directoryPath - The path of the directory to start the search from
 * @param {string} fileName - The name of the file to search for
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
