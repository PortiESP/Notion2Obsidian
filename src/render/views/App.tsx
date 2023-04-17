import sass from './App.module.scss'
import Welcome from './welcome/Welcome'

function App() {

  return (
    <div className={sass.app}>
      <div className={sass.div__header}>
        <h2>Notion2Obsidian</h2>
        <span>@PortiESP</span>
      </div>
      <div className={sass.div__body}><Welcome /></div>
    </div>
  )
}

export default App
