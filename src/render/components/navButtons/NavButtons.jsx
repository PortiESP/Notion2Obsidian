import sass from "./NavButtons.module.scss"


export default function NavButtons({scene, setScene, isPathValid}){

    function checkReqs(){
        if (scene === 2 && isPathValid === false) return false  // Check if path is valid to move from scene 2
        else return true  // If any condition is matched...
    }

    const btnBackNames = ["", "Back", "Back", "Back", "", ""]
    const btnContNames = ["Continue", "Continue", "Continue", "Convert", "Finish"]

    return (<>
        <div className={sass.div__buttons_wrap}>
            {/*BACK*/}{ btnBackNames[scene] && <button className={[sass.button__nav, sass.button__nav_back].join(" ")} onClick={()=>setScene(old=>old-1)}>{btnBackNames[scene]}</button>}
            {/*CONTINUE*/}<button className={sass.button__nav} onClick={()=>checkReqs() && setScene(old=> old+1)} disabled={!checkReqs()}>{btnContNames[scene]}</button>
            {/*+1*/}<button className={sass.button__nav} onClick={()=>setScene(old=> old+1)}>+1</button>
        </div>
    </>)
}