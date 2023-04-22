
# Notion2Obsidian

> This APP is a conversor for Notion exports to Markdown syntax

### Features 🧰

- 🖼️ Friendly GUI
- ⚙️ Automatic scripts
- 🔍 Error detection

## Disclaimer ⚠️

- 🧪 This is a beta version of the project, visit the [Github page](https://github.com/PortiESP/Notion2Obsidian/) to stay updated
- 🕷️ Please report any issues or bugs in the [issues](https://github.com/PortiESP/Notion2Obsidian/issues) section of the github page
- 🔨 Note that updates in the Notion export format may break some features, please report that in the Github issues in that case
- ♻️ This tool is will try to make a clean conversion but it is not 100% accurate, I've done my best to make the closest to a clean conversion

## Download & Export 📥

### Download the release version

Go to the github repo and download the binary marked as *release*, in the [aside section](https://i.gyazo.com/650217b495c33028a2760ee02bde7a7b.png) of the page and download the `.exe` binary

### Export you Notion workspace

In Notion, got to the *Settings & Memebers* menu in the side pannel, there go to *Settings* and the click on **Export all workspace content**

Export your workspace with the following parameters
- Export format: *Mardown & CSV*
- Include databases: *Everything*
- Include content: *Everything*
- Create forders for subpages: ON (*toggle in blue*)

Wait until the export is completed and save the ZIP where you want. Then go to the path where you have a¡saved your export and decompress it, (*copy the path of the resulting folder for the following steps*)


## Run the APP ⚙️

Run the application and follow the steps for each menu:


#### 1 - Path Selection

In the *Path Selection* view, paste the path of the decompressed ZIP (*the one that we have copyed earlier*)

#### 2 - Converter Setup

In the menu we can choose what options to enable for the conversion, I recommended to check all of them for a cleaner conversion

> **Strip hash from file names**
> This option will remove the hash from all the files and folders in the export. This option is required by other options so it is not uncheckable.
> *E.G.:* `myNote b6d4gh6gh46dr4vzx328u8u.md` as `myNote.md`

> **Move files to matching folders**
> This option will search for files that are located at the same level of a folder with its own name, this option is here because Notion generates a file for each page, and a folder for its child content. This option is required by other options so it is not uncheckable.
> *E.G.:* `./myNote.md` as `./myNote/myNote.md`

> **Generate a list of missing databases**
> When Notions exports a page that contained a reference to other list in the content, Notion does not write a URL in the page to the original list, instead a file named `Untitled Database.md`, this seems to be a bug from Notion and I hope they will fix it on future updates

> **Format URL/Img as Wikilinks**
> This option will find all ocurrences of URLs in the markdown files and replace them to a *Wikilinks* format (*External URLs are not conversed*).
> *E.G.:* `[My Note](path/to/note/note.md)` as `[[My Note]]`
> *E.G.:* `[My image](path/to/image.png)` as `[[image.png]]`

> **Strip repetitive asterisks from bold strings**
> Replace all ocurrences of bold strings wrapped between excessive astterisks by the same string wrapped only between two of thoose.
> *E.G.:* `***********bold***********` as `**bold**`

> **Format callouts for obsidian**
> Replace the callouts generated by notion as `<aside>` tags by th Obsidian supported ones as `> [!note]`, also support nested callouts

> **Generate a list of SVG files**
> Search for every page that have a `.svg` file generated, extract the data and generate a list in Dataview to fetch the pages from the parsed SVG file
> > You must have installed *Dataview* plugin and also enable the both *DataviewJS* options in settings.
> > ![Obsidian settings screenshoot](https://i.gyazo.com/8e2000df60cc72c0af585b77238ce908.png)

> **Format Notions page attributes as Obsidian's note metadata**
> This option will find metadata in the exported files, wrap it between `---` and move it to the top of the file so Obsidian can recognise it as the note metadata


#### 3 - Running 👨‍💻

At this point we should wait for the scripts to finish running, in my case, with a workspace of around 3000 pages, the APP took less than 30 seconds to finish but depends on your hardware and the size of your workspace. Also, dont panic if the application says *Not responding* it is working on the scripts and blocks the APP main loop while on it.

#### 4 - Error Log 🕷️

The last screen will show the results of the conversion, some scripts may have not worked as expected or returned some errors, here you can check in the explorer the path and error logs of the files that returned some kind of error that require your attention

> **⚠️IMPORTANT:** Save the log in a TXT file (💾 Save Report) before clicking the *Finish* button, in other case you will not be able to recover the error log.

You can also click the `\n` button next to the *Save Report* button to toggle between logs in one line or wrap the whole line

> I have also created a [document](https://github.com/PortiESP/Notion2Obsidian/blob/master/Docs/HowToHandleErrorLogs.md) where I describe the solutions for each error in the log.


## Dev. Social Media 🌐

- [Github](https://github.com/PortiESP)
- [Web](https://www.0xporti.com/)
- [Instagram](https://www.instagram.com/portii.rm/)
- [Twitter](https://twitter.com/PortiiRM)