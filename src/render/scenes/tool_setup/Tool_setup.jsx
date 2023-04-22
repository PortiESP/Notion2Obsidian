import sass from "./Tool_setup.module.scss"



export default function Setup(props){


    return (<div className={sass.div__setup_wrap}>
        <h1 className={sass.title}>🧰 Converter Setup 🧰</h1>
        <div className={sass.div__info}>
            <p className={sass.callout}>Here you can select some additional options for your conversion, some of this options are required, others are optional</p>
        </div>
        <div className={sass.div__form}>
            <p className={sass.tip}><i>TIP: Hover on each option to read more about what it does</i></p>



            <h2>Restructure export</h2>

            <div className={sass.div__item} title={props.tips.removeHash}>
                <input type="checkbox" disabled onChange={()=> props.setSetupOptions(old => {return {...old, removeHash:!old.removeHash}})} checked={props.setupOptions.removeHash} id="ck--name-hash"/>
                <label htmlFor="ck--name-hash">Strip hash from file names </label>
            </div>
            { props.setupOptions.removeHash && <p className={sass.example}><span className={sass.code}>myNote b6d4gh6gh46dr4vzx328u8u.md</span> as <span className={sass.code}>myNote.md</span></p>}

            <div className={sass.div__item} title={props.tips.moveToFolder}>
                <input type="checkbox" disabled onChange={()=> props.setSetupOptions(old => {return {...old, moveToFolder:!old.moveToFolder}})} checked={props.setupOptions.moveToFolder} id="ck--move-to-folder"/>
                <label htmlFor="ck--move-to-folder">Move files to folder with its name </label>
            </div>
            { props.setupOptions.moveToFolder && <p className={sass.example}><span className={sass.code}>./myNote.md</span> moved to <span className={sass.code}>./myNote/myNote.md</span></p>}

            <div className={sass.div__item} title={props.tips.findMissingDBs}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, findMissingDBs:!old.findMissingDBs}})} checked={props.setupOptions.findMissingDBs} id="ck--missing"/>
                <label htmlFor="ck--missing">Generate a list with missing databases </label>
            </div>



            <h2>Format elements</h2>

            <div className={sass.div__item} title={props.tips.urlFormatter}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, urlFormatter:!old.urlFormatter}})} checked={props.setupOptions.urlFormatter} id="ck--urlFormatter"/>
                <label htmlFor="ck--urlFormatter">Format URL/Img as Wikilinks </label>
            </div>
            <div className={[sass.div__item, sass.div__subitem, !props.setupOptions.urlFormatter && sass.disabled].join(" ")} title={props.tips.urlFormatterComments}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, urlFormatterComments:!old.urlFormatterComments}})} checked={props.setupOptions.urlFormatter && props.setupOptions.urlFormatterComments} id="ck--urlFormatter-comments" disabled={!props.setupOptions.urlFormatter}/>
                <label htmlFor="ck--urlFormatter-comments">Keep original URLs as Obsidian MD comment</label>
            </div>
            { props.setupOptions.urlFormatter && <p className={sass.example}><span className={sass.code}>![Alt text](https://...)</span> as <span className={sass.code}>![[Alt text]]{props.setupOptions.urlFormatterComments && " %% https://..."}</span></p>}

            <div className={sass.div__item} title={props.tips.stripAsterisks}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, stripAsterisks:!old.stripAsterisks}})} checked={props.setupOptions.stripAsterisks} id="ck--stripAsterisks"/>
                <label htmlFor="ck--stripAsterisks">Strip repetitive asterisks from bold strings </label>
            </div>
            { props.setupOptions.stripAsterisks && <p className={sass.example}><span className={sass.code}>********boldText********</span> as <span className={sass.code}>**boldText**</span></p>}

            <div className={sass.div__item} title={props.tips.calloutsFormatter}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, calloutsFormatter:!old.calloutsFormatter}})} checked={props.setupOptions.calloutsFormatter} id="ck--calloutsFormatter"/>
                <label htmlFor="ck--calloutsFormatter">Format callouts for obsidian </label>
            </div>
            { props.setupOptions.calloutsFormatter && <p className={sass.example}><span className={sass.code}>{`<aside>My Callout</aside>`}</span> as <span className={sass.code}>{`> [!note]\\n> My Callout`}</span></p>}



            <h2>Lists Formatting</h2>

            <div className={sass.div__item} title={props.tips.genListFiles}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, genListFiles:!old.genListFiles}})} checked={props.setupOptions.genListFiles} id="ck--generate-list-files"/>
                <label htmlFor="ck--generate-list-files">Generate a list from SVG files <span className={sass.labelMsg}>(IMPORTANT: you must have the plugin 'Dataview' installed with the JavaScript Queries enabled)</span></label>
                <br/>
            </div>
            {
                props.setupOptions.genListFiles &&

                <div className={sass.div__input_name_wrap}>
                    <label>Add a prefix/sufix to the generated list file <span className={sass.labelMsg}>(Add a number or a symbol to make the file standout at the beggining of the directoy)</span></label>
                    <div className={sass.div__input_name}>
                        <input type="text" onChange={ e => props.setSetupOptions(old => {return {...old, listNamePrefix:e.target.value}})} value={props.setupOptions.listNamePrefix} placeholder="Prefix" title={props.tips.listNamePrefix}/>
                        <span> + filename + </span>
                        <input type="text" onChange={ e => props.setSetupOptions(old => {return {...old, listNameSufix:e.target.value}})} value={props.setupOptions.listNameSufix} placeholder="Sufix" title={props.tips.listNameSufix}/>
                        <span>.md</span>
                    </div>
                    <p>Preview: <span className={sass.code}>{props.setupOptions.listNamePrefix}exampleList{props.setupOptions.listNameSufix}.md</span></p>
                </div>
            }

            <div className={sass.div__item} title={props.tips.metadataFormatter}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, metadataFormatter:!old.metadataFormatter}})} checked={props.setupOptions.metadataFormatter} id="ck--metadataFormatter"/>
                <label htmlFor="ck--metadataFormatter">Format Notions page attributes as Obsidian's note metadata <span className={sass.labelMsg}>(Mark this option to have addition information of the notes in the Dataview tables)</span></label>
            </div>

        </div>
    </div>)
}