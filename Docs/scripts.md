# ObsidianConverter



## Conversion algorithms

### Rename files

> This script must be executed with *powershell* and in the path where we want to perform the recursive renaming, it will also create a `errors.txt` file in the current directory where it will write the paths that had some issues renaming (*usually files with the same name in the same path, you must rename thoose yourself since obsidian doesnt support duplicated names in the same path*)

```powershell
Get-ChildItem -Recurse | Where-Object { $_.Name -match '.*\.md$|.*\.csv$|^(?!.*\.[a-zA-Z0-9]+$).+$' } | Sort-Object { $_.FullName.Length } -Descending | ForEach-Object {
    $oldName = $_.FullName
    $newName = $_.FullName -replace '([\w\s\(\)]+) \w{32}(\.md|\.csv)?$', '$1$2'
    if ($oldName -ne $newName) {
        try {
            Rename-Item -Path $oldName -NewName $newName -ErrorAction Stop
            Write-Host "Archivo original: $oldName"
            Write-Host "Archivo renombrado: $newName"
        } catch {
            $errorMessage = $_.Exception.Message
            Write-Host "Error al renombrar archivo: $errorMessage"
            Add-Content -Path errors_renaming.txt -Value "Archivo original: $oldName - Error: $errorMessage"
        }
    } else {
        Write-Host "Archivo original: $oldName no requiere ser renombrado."
    }
}
```

### Mover a la carpeta con su nombre

> Este script mueve los archivos que tengan una carpeta con su mismo nombre en su mismo nivel a esta carpeta

```powershell
Get-ChildItem -Recurse | Where-Object { $_.Extension -eq ".md" -or $_.Extension -eq ".csv" } | ForEach-Object {
    $file = $_
    $destinationFolder = Join-Path -Path $file.DirectoryName -ChildPath $file.BaseName
    if (Test-Path $destinationFolder) {
        try{
            $newName = Join-Path -Path $destinationFolder -ChildPath ($file.BaseName + $file.Extension)
            Move-Item -Path $file.FullName -Destination $newName -ErrorAction Stop
            Write-Host "Archivo movido: $($file.FullName) --> $($newName)"
        } catch{
            $errorMessage = $_.Exception.Message
            Write-Host "Error al renombrar archivo: $errorMessage"
            Add-Content -Path errors_moving.txt -Value "Archivo original: $file - Error: $errorMessage"
        }
    }
}
```


### Callout formatter

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
        Write-Host "Reemplazo realizado en: $($_.FullName)"
    } else {
        # El patrón no coincidió
        Write-Host "Sin coincidencias en: $($_.FullName)"
    }
}
```

### Detect missing DBs

Write in a `missingDBs.txt` file a list of databases that are not exported. This issue happens in linked databases, databases that are not the original one but a view of the original

```powershell
Get-ChildItem -Recurse -Filter "Untitled Database.md" | ForEach-Object { $_.FullName } > missingDBs.txt
```

### Formatting URLs

> The URLs will be formatted, but the original URL will be keept in a comment in case of there is some issue with the resource path

```powershell
Get-ChildItem -Recurse | Where-Object { $_.Extension -eq '.md' } | ForEach-Object {
    $archivo = $_.FullName
    Write-Host "Procesando archivo: $archivo"
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

    Write-Host "Expresión regular aplicada en: $($archivo.FullName)"
}
```

### Removing multiple `*`

> Removes the duplicated `*` characters such as: "\*\*\*\*\*\*\*\*\*\*\***bold**\*\*\*\*\*\*\*\*\*\*\*\*\*"

```powershell
Get-ChildItem -File -Recurse -Include *.md | ForEach-Object {
    $archivo = $_.FullName
    Write-Host "Procesando archivo: $archivo"
    $contenido = Get-Content $archivo -Raw
    $contenido = $contenido -replace '\*+\*([^\*]+)\*\*+', '**$1**'
    Set-Content $archivo $contenido
}
```

### Tablas/Listas

Hacer la tabla donde exista un .csv
	- La tabla se hace de los .md en la ruta del .csv y recursivo
	- Los datos del .csv se deben añadir como atributos a cada pagina, cada entrada del .csv coincidirá con un .md 

```python
import os, csv

# Directorio raíz donde se realizará la búsqueda recursiva
directorio_raiz = r"C:\Users\Porti\Desktop\CONVERT\Export-9f787dd1-7f28-4ead-9fa1-421bbef21fbf-Part-1\Export-9f787dd1-7f28-4ead-9fa1-421bbef21fbf\Software docs\Apps & Topics\Blender\Blender Concepts\Nodes\Nodes list"

# Lista para almacenar los archivos CSV encontrados
archivos_csv = []

# Recorrer los directorios, subdirectorios y archivos dentro del directorio raíz
for directorio_actual, _, archivos in os.walk(directorio_raiz):
    for archivo in archivos:
        if archivo.endswith(".csv"):
            # Si es un archivo CSV, agregarlo a la lista
            ruta_csv = os.path.join(directorio_actual, archivo)
            archivos_csv.append(ruta_csv)

# Recorrer los archivos CSV encontrados
for archivo_csv in archivos_csv:
    # Obtener el nombre base del archivo CSV sin la extensión
    nombre_base = os.path.splitext(os.path.basename(archivo_csv))[0]

    # Obtener los headers
    with open(archivo_csv, "r") as f:
        lector_csv = csv.reader(f)
        primera_fila = next(lector_csv)
    

    # Crear el archivo MD con el mismo nombre pero con extensión .md
    archivo_md = archivo_csv.replace(".csv", ".md")
    with open(archivo_md, "w") as f:
        # Escribir el contenido deseado en el archivo MD
        contenido = f"""```dataview
TABLE {", ".join(primera_fila[1:])}
FROM ""
WHERE contains(file.path, "{nombre_base}/")
```"""
        f.write(contenido)

print("Archivos MD creados exitosamente!")

```


### Añadir metadatos de los csv a los archivos

```python
import csv
import os

# Ruta del archivo CSV
ruta_lista = r"RUTA/DE/LA/CARPETA"
ruta_csv = os.path.join(ruta_lista, os.path.basename(ruta_lista) + ".csv")

# Ruta del archivo de registro
ruta_log = os.path.join(ruta_lista, "log_lista.txt")

# Leer el archivo CSV y agregar el contenido como atributos de Obsidian
with open(ruta_csv, "r") as archivo_csv:
    lector_csv = csv.reader(archivo_csv)
    # Ignorar la primera fila (encabezados)

    headers = next(lector_csv)[1:]
    for fila in lector_csv:
        # Obtener el nombre del archivo Markdown y el contenido de la fila
        nombre_md = fila[0] + ".md"

        # Ruta completa del archivo Markdown
        ruta_md = os.path.join(ruta_lista, fila[0], nombre_md)

        # Verificar si la ruta del archivo Markdown existe
        if os.path.exists(ruta_md):
            # Leer el contenido actual del archivo Markdown
            with open(ruta_md, "r") as archivo_md:
                lineas_md = archivo_md.readlines()

            i = 2  # Línea 3
            while i < len(lineas_md):
                if not lineas_md[i].strip(): # Si la línea está vacía
                    if i != 2: lineas_md[i-1] += '---\n'
                    break 
                    
                if i == 2 and ":" in lineas_md[2] : lineas_md[1] += '---\n'
                else: break  # Si no son metadataos 
                i += 1

            # Escribir el contenido actualizado en el archivo Markdown
            with open(ruta_md, "w") as archivo_md:
                archivo_md.writelines(lineas_md)

            print(f"Metadatos agregados en el archivo Markdown {nombre_md}")
        else:
            print(f"El archivo Markdown {nombre_md} no existe. Registrando en el archivo de log.")
            # Registrar en el archivo de log
            with open(ruta_log, "a") as archivo_log:
                archivo_log.write(f"[Archivo no encontrado]: {ruta_md}")

print("Proceso completado exitosamente!")

```