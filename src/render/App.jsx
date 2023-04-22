import { useEffect, useState } from 'react'
import sass from './App.module.scss'
import {postOfficeSendCBK, postOfficeSend} from "@/components/postOffice"
import NavButtons from './components/navButtons/NavButtons'

// Assets
import ghIcon from "./assets/github-original.svg"
import appIcon from "./assets/icon.png"

// Scenes
import Welcome from '@/scenes/welcome/Welcome.jsx'
import Information from '@/scenes/information/Information.jsx'
import Path_selection from '@/scenes/path_selection/Path_selection.jsx'
import ToolSetup from '@/scenes/tool_setup/Tool_setup.jsx'
import RunScripts from '@/scenes/run_scripts/Run_scripts.jsx'
import ShowResults from '@/scenes/show_results/Show_Results.jsx'

function App() {

  // Path of the Notion export folder
  const [exportPath, setExportPath] = useState("")  // Path introduced by the user
  // Checking if path is valid on changes
  useEffect(()=>{
    postOfficeSendCBK("check-path", exportPath, (res)=> setIsPathValid(res))
  }, [exportPath])

  // Tool Setup options
  const [setupOptions, setSetupOptions] = useState({
    removeHash: true,
    moveToFolder: true,
    urlFormatter: true,
    urlFormatterComments: true,
    stripAsterisks: true,
    calloutsFormatter: true,
    findMissingDBs: true,
    genListFiles: true,
    listNamePrefix: "@LIST@__",
    listNameSufix: "",
    metadataFormatter: true,
  })
  // Results returned from the scripts
  const [results, setResults] = useState(undefined)
  useEffect(()=>{
    console.log("Results: ", results)
  },[results])

  const tips = {
    removeHash: "Remove the hashes from all of the directories and and files name (but not form the references inside the files)",
    moveToFolder: "If a file is at the same path of a directory with the same name, move the file into that directory",
    urlFormatter: "Convert the clasic Markdown URLs and Images into wikilinks format",
    urlFormatterComments: "Keep the original URLs as comments in case the URLs gets broken, you can recover the original URL",
    stripAsterisks: "Remove repeated asterisks from bold stings",
    calloutsFormatter: "Convert Notion callouts to Obsidian callouts format",
    findMissingDBs: "Generate a file with the path of the missing databases (File is empty and with name 'Untitled Database.md')",
    genListFiles: "Generate a list '.md' file based on the data of the '.svg' files using the Dataview plugin with the properties of the notes al columns ",
    listNamePrefix: "Allows the user to add a prefix to the generated list file (previous checkbox) so it may be easyer to difference from normal notes in the explorer",
    listNameSufix: "Same as the prefix, but add at the end of the filename",
    metadataFormatter: "Take the Notions properties and parse them as Obsidians note metadata, wrapped between '---'",
  }
  useEffect(()=>{
    console.log(setupOptions)
  }, [setupOptions])
  
  // Scene manager
  const [scene, setScene] = useState(0)  // Initial scene
  const [isPathValid, setIsPathValid] = useState(false)  // Hold if selected path does not exist

  // Scene list
  const sceneList = [
      <Welcome/>,  // Welcome scene
      <Information/>,  // Information and License
      <Path_selection exportPath={exportPath} setExportPath={setExportPath} isPathValid={isPathValid}/>,  // Choose the export file path
      <ToolSetup setupOptions={setupOptions} setSetupOptions={setSetupOptions} tips={tips}/>,  // Tool setup: Select the scripts and othe stuff
      <RunScripts setupOptions={setupOptions} exportPath={exportPath} setResults={setResults}/>,  // Loading screen
      <ShowResults results={results}/>,  // Show the errors returned by the scripts
    ]
  // Exit when last scene is reached
  useEffect(()=>{
    scene === sceneList.length && postOfficeSend("exit", null)
  },[scene])

  return (
    <div className={sass.app}>
      <div className={sass.div__header}>
        <h2><img src={appIcon}/>Notion2Obsidian</h2>
        <span onClick={()=>postOfficeSend("open-url", "https://github.com/PortiESP/Notion2Obsidian")}><img src={ghIcon}/>PortiESP</span>
      </div>
      <div className={sass.div__body}>
        <div className={sass.div__scene_wrap}>
          {sceneList[scene]}
        </div>
        <NavButtons scene={scene} setScene={setScene} isPathValid={isPathValid} results={results} setupOptions={setupOptions}/>
      </div>
    </div>
  )
}

export default App
