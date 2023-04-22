import sass from "./Path_selection.module.scss"

export default function Path_selection({isPathValid, exportPath, setExportPath}){

    console.log("Is path valid: ", isPathValid)

    return (<div className={sass.div__pathselection_wrap}>
        <h1 className={sass.title}>🗃️ Path Selection 🗃️</h1>
        <div className={sass.div__info}>
            <p className={sass.callout}>Export your Notion workspace as Markdown & CSV, include everything and create folders for subpages. Then extract the ZIP/RAR and copy the path of the forlder here</p>
        </div>
        <div className={sass.div__form}>
            <input 
                type="text" 
                className={[sass.input__file, isPathValid && sass.valid].join(" ")} 
                value={exportPath}
                onChange={e => setExportPath(e.target.value.replaceAll("\\", "/"))}
                placeholder="📁Select folder path..."
            />
            <span className={sass.span__path}>{isPathValid ? "" : "Path not found in the system..."}</span>
        </div>
    </div>)
}