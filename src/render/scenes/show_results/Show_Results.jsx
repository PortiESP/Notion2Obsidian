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
        <button onClick={download} className={sass.button__download}>💾 Save Report</button>
    </div>)
}