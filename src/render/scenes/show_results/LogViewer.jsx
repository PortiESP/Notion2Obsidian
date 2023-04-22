import sass from "./LogViewer.module.scss"
import { useEffect, useState } from "react"
import {postOfficeSend} from "@/components/postOffice"


export default function LogViewer({logs}){

    const logOptions = ["All logs", ...Object.values(logs).map(e=>e.label)]
    const parsedLogs = [ undefined, ...Object.values(logs)?.map( (e) => {
        const {_, data} = e
        // Flatting array of data
        if (data.length === 0) return null
        else if (data[0].length !== undefined) return data  // isArray
        else return data.map(e=> `[File]: ${e.file} - [Error]: ${e.error}`)
    } )]
    // Use the first index to store a full list of all the logs
    parsedLogs[0] = parsedLogs.slice(1).flat()

    const [log, setLog] = useState(parsedLogs[0])
    const [linebreak, setLineBreak] = useState(true)

    
    const download = () => {
        console.log("Saving results: ", logs)
        postOfficeSend("save-results", logs)
    }


    return (<div className={sass.div__wrap}>
        <div  className={sass.div__header}>
            <select onChange={e => setLog(parsedLogs[e.target.value])} defaultValue={"All logs"}>
                {logOptions.map((label,i) => <option key={i} value={i} >{label} ({parsedLogs[i]?.length || 0})</option>)}
            </select>
            <div className={sass.div__icons}>
                <input type="checkbox" id="icon--linebreak" onChange={()=>setLineBreak(old=>!old)} checked={linebreak}/>
                <label htmlFor="icon--linebreak" className={sass.icon} >\n</label>
                <span  className={sass.icon} onClick={download}>💾 Save Report</span>
            </div>
        </div>
        <div className={sass.div__list}>
            { log?.filter(e=>e?.length).map((text, i) => {return <div key={i} className={sass.div__log_item}><p className={!linebreak ? sass.multiline: ""}>{text}</p></div>})}
        </div> 
    </div>)
}