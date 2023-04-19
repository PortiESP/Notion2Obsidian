import sass from "./Run_scripts.module.scss"
import postOffice from "@/components/postOffice"

export default function RunScripts(props){

    // Parameters
    const scriptName = "Removing blablabla..."
    const scriptProgress = `${1}/${2}`
    let pctg = 20

    // Run scripts
    postOffice("run-scripts", {exportPath: props.exportPath, ...props.setupOptions})


    return (<div className={sass.div__runscripts_wrap}>
        
        <div className={sass.div__progress_wrap}>
            <p className={sass.p__info}>Running script...<span>⚙️</span></p>
            <div className={sass.div__progress_outter}>
                <div className={sass.div__progress_inner} style={{width: pctg + "%"}}>

                </div>
            </div>
            <p className={sass.p__status}>{scriptName}<span>{scriptProgress}</span></p>
        </div>
    </div>)
}