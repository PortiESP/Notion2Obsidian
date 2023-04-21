const fs = require('fs');
const path = require('path');
const getAllFilesRecursively = require('./getAllFilesRecursively.cjs');

/**
 * Function to parse SVG files from Notion export and format as a DataviewJS block un a new MD file where a list is created 
 * with the data from the SVG
 *
 * @param {string} directoryPath - The path of the directory to start the search from
 * @param {Object} nameFormat - An optional object that specifies the format of the output MD file names. It has two properties:
 *   @param {string} nameFormat.prefix - An optional prefix string to be added to the base name of the CSV file when creating the MD file. Default is an empty string.
 *   @param {string} nameFormat.sufix - An optional suffix string to be added to the base name of the CSV file when creating the MD file. Default is an empty string.
 * @param {boolean} debug - An optional boolean flag that determines whether to enable debug mode or not. When set to true, debug information will be printed to the console. Default is false.
 *
 */
module.exports = function listFormatter(directoryPath, nameFormat={prefix:"", sufix:""}, debug=true) {

  const errorLog = []

  // Get a list of all the files
  const csvFiles = getAllFilesRecursively(directoryPath, false).filter( filePath => path.parse(filePath).ext === ".csv")

  // Loop through the found CSV files
  for (const csvFile of csvFiles) {
    try {
      
      // Algorith that generates the list files
      algorithm(csvFile, nameFormat, debug)

    } catch (err) {
      // Log any errors that occur during execution to the error log file
      errorLog.push({file: csvFile, error: err.message});
      if (debug) `[x] Error: err.message`;
    }
  }

  if (debug) console.log('[i] MD files created successfully!');

  return errorLog;
}




function algorithm(csvFile, nameFormat={prefix:"", sufix:""}, debug=true){

  // Get the base name of the CSV file without extension
  const baseName = path.basename(csvFile, path.extname(csvFile));

  // Read the CSV file and get the headers, using slice to remove artifact "﻿"
  const csvData = fs.readFileSync(csvFile, 'utf8').replaceAll("\r", "").slice(1);
  let itemsList = csvData.split("\n")  //Parse the csv
  // Extract the headers
  const headers = itemsList[0].split(",")
                                          .filter( e => !/[^\u0000-\u007F]/.test(e))  // Comprueba si no tiene caracteres ASCII los cuales dan error en el dataview
                                          .map(e => e.replaceAll(" ", "-")     // Replace characters that cause bugs in obsidian to a valid character
                                                      .replaceAll(/[\(\)]/g, "")
                                                      .toLowerCase() );  
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
    .map(e => [e.file.link, ${metatagsStr}]))\n\`\`\``.replaceAll("\r", "");

  fs.writeFileSync(mdFile, content, 'utf8');
  
  if (debug) "[+] New list created: " + mdFile;

}