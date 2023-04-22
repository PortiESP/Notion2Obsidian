import LogViewer from "./LogViewer"
import sass from "./Show_Results.module.scss"
import template from "./test"
// import template from "./test"

export default function ResultsPage({results}){
    
    return (<div className={sass.div__results_wrap}>
        <h1 className={sass.title}>🕷️ Error Log 🕷️</h1>
        <div className={sass.callout}>Here you can view and save a report of the errors returned by the scripts, this errors may require to be handled manualy</div>
        <div className={sass.div__log_wrap}>
            <div>
                <p className={sass.p__msg}>Total logs that require to be handled manualy <span>({results ? Object.values(results).map(e=>e.data).reduce((accum, list)=>[...accum, ...list]).length : 0})</span></p>
                <p className={sass.p__msg}>Check this <a className={sass.a} onClick={()=>postOfficeSend("open-url", "https://github.com/PortiESP/Notion2Obsidian/tree/master/Docs/HowToHandleErrorLogs.md")}>document</a> to know what actions you must take to handle this logs</p>
            </div>
            <div className={sass.div__viewer}>
                <LogViewer logs={results||{}}/>
            </div>
        </div>
    </div>)
}



