import sass from "./Tool_setup.module.scss"



export default function Setup(props){


    return (<div className={sass.div__setup_wrap}>
        <h1 className={sass.title}>🧰Converter Setup🧰</h1>
        <div className={sass.div__info}>
            <p className={sass.callout}>Here you can select some additional options for your conversion, some of them are optional, but others are required</p>
        </div>
        <div className={sass.div__form}>
            <p><i>Hover on each option to read more about what it does</i></p>

            <div className={sass.div__item} title={props.tips.nameHash}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, nameHash:!old.nameHash}})} checked={props.setupOptions.nameHash} id="ck--name-hash"/>
                <label htmlFor="ck--name-hash">String hash from file names </label>
            </div>
            <div className={sass.div__item} title={props.tips.moveToFolder}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, moveToFolder:!old.moveToFolder}})} checked={props.setupOptions.moveToFolder} id="ck--move-to-folder"/>
                <label htmlFor="ck--move-to-folder">Move files to folder with its name </label>
            </div>
            <div className={sass.div__item} title={props.tips.wikilinks}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, wikilinks:!old.wikilinks}})} checked={props.setupOptions.wikilinks} id="ck--wikilinks"/>
                <label htmlFor="ck--wikilinks">Format URL/Img as Wikilinks </label>
            </div>
            <div className={sass.div__item} title={props.tips.asterisks}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, asterisks:!old.asterisks}})} checked={props.setupOptions.asterisks} id="ck--asterisks"/>
                <label htmlFor="ck--asterisks">Strip repetitive asterisks from bold strings </label>
            </div>
            <div className={sass.div__item} title={props.tips.callouts}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, callouts:!old.callouts}})} checked={props.setupOptions.callouts} id="ck--callouts"/>
                <label htmlFor="ck--callouts">Format callouts for obsidian </label>
            </div>
            <div className={sass.div__item} title={props.tips.missing}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, missing:!old.missing}})} checked={props.setupOptions.missing} id="ck--missing"/>
                <label htmlFor="ck--missing">Generate a list with missing databases </label>
            </div>
            <div className={sass.div__item} title={props.tips.genListFiles}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, genListFiles:!old.genListFiles}})} checked={props.setupOptions.genListFiles} id="ck--generate-list-files"/>
                <label htmlFor="ck--generate-list-files">Generate a list from SVG files (<i>This option uses the 'Dataview' plugin with javascript queries enabled</i>) </label>
                <br/>
            </div>
            <div className={sass.div__item_input}>
                <label>Add a prefix/sufix to the generated list file </label>
                <input type="text" onChange={ e => props.setSetupOptions(old => {return {...old, listNamePrefix:e.target.value}})} value={props.setupOptions.listNamePrefix} placeholder="Prefix" title={props.tips.listNamePrefix}/>
                <input type="text" onChange={ e => props.setSetupOptions(old => {return {...old, listNameSufix:e.target.value}})} value={props.setupOptions.listNameSufix} placeholder="Sufix" title={props.tips.listNameSufix}/>
            </div>
            <div className={sass.div__item} title={props.tips.metadata}>
                <input type="checkbox" onChange={()=> props.setSetupOptions(old => {return {...old, metadata:!old.metadata}})} checked={props.setupOptions.metadata} id="ck--metadata"/>
                <label htmlFor="ck--metadata">Format metadata as Obsidian's note metadata </label>
            </div>
        </div>
    </div>)
}