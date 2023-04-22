
# How to handle the results of the logs

The error logs provide a list of paths that failed in the process of running some script, check this paths manualy to make an idea of what caused the error, in some cases the log gives a hind about it.

> Please, note that some of the errors or fails during the conversion process may be because Notion does not export the files right, in some cases there is no straigt solution that I can implement, there only possibility is that you check the original page in notion and check what should be the right result of the export. Anyway I will do my best to try to make the tool as automatic as possible to get the closest to a *Clean* conversion.

> Also notice that updates in the Notion export format or Obsidian and Dataview pluging can lead to scripts not working as expected any more.


--------------------

## Strip hash from hash names `removeHashLogs`

Some files might trigger errors because of the lack of privileges over the directory, check if other process is using the same resource while you are running the app, but also in my case I've noticed that this could be because there is already a file with that name (dont know why) so the file with the hash cant be renamed.

I hope that the files with this error are the minimal, I my case only very few of the files returned this error.

--------------------



## Move files to folder with its name `moveToFolderLogs`

Same issue as the above error, check the privileges or ensure that no other process is using the resource.

--------------------


## Generate a list with missing databases `findMissingDBsLogs`

This files appear when in that same directory, other note was referencing a list that was not the original list but a reference of other list (*see the image below*). In this case Notion fails to export that file with an URL to the original database (list) and instead it gererates this file named `'Untitled Database.md'`.
![Example Screenshoot 1](https://i.gyazo.com/e6d9d57ab8f4b98047c3700e5a80f6e2.png)

> **FIX:** Check in Notion what page in that path had a reference to other list and add yourself the wikilink with the URL of that list: `![[Original List.md]]`.

--------------------


## Format URL/Img as Wikilinks `urlFormatterLogs`

We must have to check the *Generate a list from SVG files* option, in other case the lists of the page will fail to locate the list file to display.

--------------------


## Strip repetitive asterisks from bold strings `stripAsterisksLogs`

Notion sometimes does not make export clean exports, and it place some extra arrays of asterisks. 

> **FIX:** Check this files and remove the asterisks.
> *TIP:* You can use text editors, such as VSCode, and use the Find&Replace tool **RegEx** patterns to replace this asterisks: Remove them with the pattern (`\*{3}`), this will remove chains of 3 or more asterisks.

> **Powershell script to remove the asterisks (windows)**
>
> > IMPORTANT: You should never run a script without analyzing it first or it comes from a reliable source, I will always recomment to ask **ChatGPT** for potential dangers of each script before running any unknown script from any unknown source.
> 
> Here I have a powershell script for you to remove all chains of 3 or more consecutive '*'.
> *HOW TO USE IT:*
> 1. Open the file explorer and navigate to the folder where you want to apply the script to the whole path (subfiles included)
> 2. In the *Address Bar (see the image below)*, type `powershell`, this step will open the command terminal in the current path 
>   ![Windows Explorer Image](https://www.teachucomp.com/wp-content/uploads/blog-5-6-2022-fileexplorerinwindows11.png)
> 3. Paste the script and press enter
> 
> ```powershell
> # Get a list of all the files and subfiles, and iterate over each one
> Get-ChildItem -File -Recurse -Include *.md | ForEach-Object {
>     $filePath = $_.FullName  # Save the path of the file in `$filePath`
>     $fileContent = Get-Content $filePath -Raw  # Read the content of the file and save it at `$fileContent`
>     $fileContent = $fileContent -replace '\*{3,}', ''  # Perform the replace using RegEx patterns
>     Set-Content $filePath $fileContent  # Save the changes in the file
>     Write-Host "Processed: $filePath"  # Print a string for each file processed (dont panic when your screen gets flooded with lots of log messages like this)
> } 
> ```

--------------------


## Format callouts for obsidian `calloutsFormatterLogs`

If the script doesnt parse all of the callouts of the file, that file will be added to the log list so the user can check what happend, this error can happen because there is a missing opening/closing tag (`<aside>`/`</aside>`) in the file.

--------------------

## Generate a list from SVG files `genListFilesLogs`

If a list doesnt load as it should be, this might be that some of the parameters of the SVG file had some wild characters that messed thing up in the algorithm, please report this in the *[issues](https://github.com/PortiESP/Notion2Obsidian/issues)* section of this repo.

Characters like "`(`", "`.`", "`:`", ...; In the name of the file or the attributes can break things the algorithm and prevent the list from being formatted well.

--------------------

## Format Notions page attributes as Obsidian's note metadata `metadataFormatterLogs`

The algorithm may fail detecting the path where the page of the item in a list is located and could not prase the metadata of that specific file.

> **FIX:** Check thoose files and wrap the metadata between `---`, also enside to move the metadata to the first line on the file (even above the title).
