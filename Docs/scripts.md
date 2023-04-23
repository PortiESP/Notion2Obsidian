# ObsidianConverter


> This scripts are the ones I've written before translating to JS, you can use one of thoose if you dont want to use the app but they are not updated with the most recent fixes


## Rename files

> This script must be executed with PowerShell and in the path where we want to perform the recursive renaming. It will also create an errors.txt file in the current directory where it will write the paths that had some issues renaming (usually files with the same name in the same path). You must rename those yourself since Obsidian doesn't support duplicated names in the same path.

```powershell
Get-ChildItem -Recurse | Where-Object { $_.Name -match '.*\.md$|.*\.csv$|^(?!.*\.[a-zA-Z0-9]+$).+$' } | Sort-Object { $_.FullName.Length } -Descending | ForEach-Object {
    $oldName = $_.FullName
    $newName = $_.FullName -replace '([\w\s\(\)]+) \w{32}(\.md|\.csv)?$', '$1$2'
    if ($oldName -ne $newName) {
        try {
            Rename-Item -Path $oldName -NewName $newName -ErrorAction Stop
            Write-Host "Original file: $oldName"
            Write-Host "New file: $newName"
        } catch {
            $errorMessage = $_.Exception.Message
            Write-Host "Error renaming the file: $errorMessage"
            Add-Content -Path errors_renaming.txt -Value "Original file: $oldName - Error: $errorMessage"
        }
    } else {
        Write-Host "Original file: $oldName does not need to be renamed."
    }
}
```

## Move file to a folder

> This script moves files that have a folder with the same name at the same level to this folder.

```powershell
Get-ChildItem -Recurse | Where-Object { $_.Extension -eq ".md" -or $_.Extension -eq ".csv" } | ForEach-Object {
    $file = $_
    $destinationFolder = Join-Path -Path $file.DirectoryName -ChildPath $file.BaseName
    if (Test-Path $destinationFolder) {
        try{
            $newName = Join-Path -Path $destinationFolder -ChildPath ($file.BaseName + $file.Extension)
            Move-Item -Path $file.FullName -Destination $newName -ErrorAction Stop
            Write-Host "File moved: $($file.FullName) --> $($newName)"
        } catch{
            $errorMessage = $_.Exception.Message
            Write-Host "Error renaming file: $errorMessage"
            Add-Content -Path errors_moving.txt -Value "Original file: $file - Error: $errorMessage"
        }
    }
}
```


## Callout formatter

> This script will format the files and replaceing the Notion callout block to the Obsidian version

```powershell
Get-ChildItem -recurse | Where-Object { $_.extension -eq '.md' } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $matchResults = $content | Select-String -Pattern "<aside>\n*([\s\S]*?)</aside>" -AllMatches
    if ($matchResults.Matches.Count -gt 0) {
        # El patrón coincidió, se extrae el substring
        $updatedContent = $content
        foreach ($match in $matchResults.Matches){
            $grupo = $match.Groups[1].Value 
            #$grupo = $grupo -replace "\r?\n$", ""
            $parsed = "> [!note]`n" + $grupo -replace "`n", "`n>"
            $updatedContent = $updatedContent -replace [regex]::Escape($match.Value), $parsed
        }
        Set-Content $_.FullName -Value $updatedContent
        Write-Host "Replacement at: $($_.FullName)"
    } else {
        # El patrón no coincidió
        Write-Host "No matches at: $($_.FullName)"
    }
}
```

## Detect missing DBs

Write in a `missingDBs.txt` file a list of databases that are not exported. This issue happens in linked databases, databases that are not the original one but a view of the original

```powershell
Get-ChildItem -Recurse -Filter "Untitled Database.md" | ForEach-Object { $_.FullName } > missingDBs.txt
```

## Formatting URLs

> The URLs will be formatted, but the original URL will be keept in a comment in case of there is some issue with the resource path

```powershell
Get-ChildItem -Recurse | Where-Object { $_.Extension -eq '.md' } | ForEach-Object {
    $archivo = $_.FullName
    Write-Host "Processing files: $archivo"
    $contenido = Get-Content $archivo -Raw
    $contenido = $contenido -replace '(!?)\[(.+?)\]\(([^)]+)\)', '$1[[$2]] %% $3'
    Set-Content $archivo $contenido
}
```

> We can remove the comments with the pattern `s/(?!\[\[.+\]\]) +%%.*//g`

```powershell
$archivos = Get-ChildItem -File -Recurse -Include *.md

# Iterar a través de cada archivo
foreach ($archivo in $archivos) {
    # Leer el contenido del archivo
    $contenido = Get-Content $archivo.FullName -Raw

    # Aplicar la expresión regular y reemplazar el contenido del archivo
    $contenidoActualizado = $contenido -replace '(?!\[\[.+\]\]) +%%.*', ''

    # Escribir el contenido actualizado en el archivo
    Set-Content $archivo.FullName -Value $contenidoActualizado

    Write-Host "RegEx applied at: $($archivo.FullName)"
}
```

## Removing multiple `*`

> Removes the duplicated `*` characters such as: "\*\*\*\*\*\*\*\*\*\*\***bold**\*\*\*\*\*\*\*\*\*\*\*\*\*"

```powershell
Get-ChildItem -File -Recurse -Include *.md | ForEach-Object {
    $archivo = $_.FullName
    Write-Host "Processing file: $archivo"
    $contenido = Get-Content $archivo -Raw
    $contenido = $contenido -replace '\*+\*([^\*]+)\*\*+', '**$1**'
    Set-Content $archivo $contenido
}
```

## Generate lists

```python
import os, csv

# Root directory where the recursive search will be performed
root_directory = r"PATH/TO/FOLDER"

# List to store the found CSV files
csv_files = []

# Traverse the directories, subdirectories, and files within the root directory
for current_dir, _, files in os.walk(root_directory):
    for file in files:
        if file.endswith(".csv"):
            # If it's a CSV file, add it to the list
            csv_path = os.path.join(current_dir, file)
            csv_files.append(csv_path)

# Traverse the found CSV files
for csv_file in csv_files:
    # Get the base name of the CSV file without extension
    base_name = os.path.splitext(os.path.basename(csv_file))[0]

    # Get the headers
    with open(csv_file, "r") as f:
        csv_reader = csv.reader(f)
        first_row = next(csv_reader)
    

    # Create the MD file with the same name but with .md extension
    md_file = csv_file.replace(".csv", ".md")
    with open(md_file, "w") as f:
        # Write the desired content to the MD file
        content = f"""```dataview
TABLE {", ".join(first_row[1:])}
FROM ""
WHERE contains(file.path, "{base_name}/")
```"""
        f.write(content)

print("MD Files created successfully!")

```


## Add metadata of the files

```python
import csv
import os

# Path to the CSV file
lista_path = r"PATH/OF/THE/FOLDER"
csv_path = os.path.join(lista_path, os.path.basename(lista_path) + ".csv")

# Path to the log file
log_path = os.path.join(lista_path, "log_lista.txt")

# Read the CSV file and add the contents as Obsidian attributes
with open(csv_path, "r") as csv_file:
    csv_reader = csv.reader(csv_file)
    # Ignore the first row (headers)
    headers = next(csv_reader)[1:]

    for row in csv_reader:
        # Get the name of the Markdown file and the contents of the row
        md_name = row[0] + ".md"

        # Full path of the Markdown file
        md_path = os.path.join(lista_path, row[0], md_name)

        # Check if the Markdown file path exists
        if os.path.exists(md_path):
            # Read the current contents of the Markdown file
            with open(md_path, "r") as md_file:
                md_lines = md_file.readlines()

            i = 2  # Line 3
            while i < len(md_lines):
                if not md_lines[i].strip(): # If the line is empty
                    if i != 2: md_lines[i-1] += '---\n'
                    break 
                    
                if i == 2 and ":" in md_lines[2]: md_lines[1] += '---\n'
                else: break  # If not metadata 
                i += 1

            # Write the updated contents to the Markdown file
            with open(md_path, "w") as md_file:
                md_file.writelines(md_lines)

            print(f"Metadata added to the Markdown file {md_name}")
        else:
            print(f"The Markdown file {md_name} does not exist. Logging to the log file.")
            # Log the error in the log file
            with open(log_path, "a") as log_file:
                log_file.write(f"[File not found]: {md_path}")

print("Process completed successfully!")
```


