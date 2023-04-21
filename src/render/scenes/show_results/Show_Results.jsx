import sass from "./Show_Results.module.scss"
import {postOfficeSend} from "@/components/postOffice"


export default function ResultsPage({results}){

    const download = () => {
        console.log("saving results: ", results)
        postOfficeSend("save-results", results)
    }

    return (<div className={sass.div__results_wrap}>
        <h1 className={sass.title}>🕷️Error Log🕷️</h1>
        <div className={sass.callout}>Here you can view and save a report of the errors returned by the scripts, this errors may require to be handled manualy</div>
        <div>
            <p className={sass.p__msg}>Total logs that require to be handled manual <span>({results ? Object.values(results).reduce((accum, list)=>[...accum, ...list]).length : 0})</span></p>
            <p className={sass.p__msg}>Check this <a className={sass.a} onClick={()=>postOfficeSend("open-url", "https://github.com/PortiESP/Notion2Obsidian/tree/master/Docs/HowToHandleErrorLogs.md")}>document</a> to know what actions you must take to handle this logs</p>
        </div>
        <button onClick={download} className={sass.button__download}>💾 Save Report</button>
    </div>)
}