import { useEffect, useState } from "react"
import sass from "./Run_scripts.module.scss"
import { postOfficeSendAndListen } from "../../components/postOffice"

export default function RunScripts(props){

    const [num, setNum] = useState(0)
    const maxNum = Object.values(props.setupOptions).filter(e => e === true).length - 1
    
    // Parameters
    const [msg, setMsg] = useState("Starting progress...")
    // Substracting "-1" because wikilinksComments and wikilinks are one script
    const scriptProgress = `${num}/${maxNum}`
    let pctg = num/maxNum * 100

    // Listener callback
    const statusUpdate = (e, res) => {
        console.log("Status update: ", res)
        res===true && setNum(old => old+1)     // If response if true, script is completed
        typeof(res)==='string' && setMsg(res)  // If response is a string, set as message
        typeof(res)==='object' && props.setResults(res)  // If response is a string, set as message
    }
    
    // Run scripts
    useEffect(()=>{
        console.log("Sending message to run scripts: ", {exportPath: props.exportPath, ...props.setupOptions})
        postOfficeSendAndListen("run-scripts", {exportPath: props.exportPath, ...props.setupOptions}, "response-script-status", statusUpdate)
    },[])
    
    

    return (<div className={sass.div__runscripts_wrap}>
        
        <div className={sass.div__progress_wrap}>
            <p className={sass.p__info}>Running scripts...<span>⚙️</span></p>
            <div className={sass.div__progress_outter}>
                <div className={sass.div__progress_inner} style={{width: pctg + "%"}}>

                </div>
            </div>
            <p className={sass.p__status}>{msg}<span>{scriptProgress}</span></p>
        </div>
    </div>)
}