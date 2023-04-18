import { useEffect, useState } from 'react'
import sass from './App.module.scss'
import po from "@/components/postOffice"

// Scenes
import Welcome from '@/scenes/welcome/Welcome.jsx'
import Information from '@/scenes/information/Information.jsx'
import Path_selection from '@/scenes/path_selection/Path_selection.jsx'

function App() {

  // Path of the Notion export folder
  const [exportPath, setExportPath] = useState("")  // Path introduced by the user
  // Checking if path is valid on changes
  useEffect(()=>{
    po("checkPath", exportPath, (res)=> setIsPathValid(res))
  }, [exportPath])

  // Scene manager
  const [scene, setScene] = useState(0)  // Initial scene
  const [isPathValid, setIsPathValid] = useState(false)  // Hold if selected path does not exist

  // Scene list
  const sceneList = [
      <Welcome setScene={setScene}/>,  // Welcome scene
      <Information setScene={setScene}/>,  // Information and License
      <Path_selection setScene={setScene} exportPath={exportPath} setExportPath={setExportPath} isPathValid={isPathValid} setIsPathValid={setIsPathValid}/>,  // Choose the export file path
    ]

  // Check requirements to press `continue` button
  function checkReqs(){
    if (scene === 2 && isPathValid === false) return false  // Check if path is valid to move from scene 2
    else return true
  }

  return (
    <div className={sass.app}>
      <div className={sass.div__header}>
        <h2>Notion2Obsidian</h2>
        <span>@PortiESP</span>
      </div>
      <div className={sass.div__body}>
        <div className={sass.div__scene_wrap}>
          {sceneList[scene]}
        </div>
        <div className={sass.div__buttons_wrap}>
          {scene > 0 && <button className={[sass.button__nav, sass.button__nav_back].join(" ")} onClick={()=>setScene(old=>old-1)}>Back</button>}
          <button className={sass.button__nav} onClick={()=>checkReqs() && setScene(old=> old+1)}>Continue</button>
          <button className={sass.button__nav} onClick={()=>setScene(old=> old+1)}>+1</button>
        </div>
      </div>
    </div>
  )
}

export default App
