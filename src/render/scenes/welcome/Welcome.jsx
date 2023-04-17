import sass from "./Welcome.module.scss"
import po from "@/components/postOffice"

export default function Welcome(props){
    
    const click = () => po("debug", "test")

    return (<div className={sass.div__welcome_wrap}>
        <div className={sass.div__information}>
            <h1>👋Welcome👋</h1>
            <p><i>Convert your Notion workspace to Obsidian notes</i></p>
        </div>
        <button className={sass.button__continue} onClick={click}>Continue</button>
    </div>)
}