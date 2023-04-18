import postOffice from "../../components/postOffice"
import sass from "./Information.module.scss"

export default function Information(){

    return (<div className={sass.div__information_wrap}>

            <h1 className={sass.title}>💡Information💡</h1>
            <div className={sass.div__info_wrap}>
                <div className={sass.div__item}><span>🧪</span><p> This is a <b className={sass.b}>beta</b> version of the project, visit the <a className={sass.a} onClick={()=>postOffice("openUrl", "https://github.com/PortiESP/Notion2Obsidian")}>Github</a> page to stay updated</p></div>
                <div className={sass.div__item}><span>🕷️</span><p> Please <b className={sass.b}>report</b> any issues or bugs in the <a className={sass.a} onClick={()=>postOffice("openUrl", "https://github.com/PortiESP/Notion2Obsidian/issues")}>issues</a> section of the github page</p></div>
                <div className={sass.div__item}><span>🔨</span><p> Note that <b className={sass.b}>updates</b> in the Notion export format may break some features, please report that in the Github issues in that case</p></div>
                <div className={sass.div__item}><span>♻️</span><p> This tool is will try to make a <b className={sass.b}>clean conversion</b> but it is not 100% accurate, report any unconverted blocks</p></div>
            </div>
    </div>)
}