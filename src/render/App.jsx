import { useState } from 'react'
import sass from './App.module.scss'

// Scenes
import Welcome from '@/scenes/welcome/Welcome.jsx'

function App() {

  const [scene, setScene] = useState(0)
  const sceneList = [
      <Welcome setScene={setScene}/>,  // Welcome scene
      
    ]

  return (
    <div className={sass.app}>
      <div className={sass.div__header}>
        <h2>Notion2Obsidian</h2>
        <span>@PortiESP</span>
      </div>
      <div className={sass.div__body}>{sceneList[scene]}</div>
    </div>
  )
}

export default App
