import sass from "./Welcome.module.scss"


export default function Welcome(){
    
    return (<div className={sass.div__welcome_wrap}>
        <div className={sass.div__information}>
            <h1>👋Welcome👋</h1>
            <p><i>Convert your Notion workspace to Obsidian notes</i></p>
        </div>
    </div>)
}