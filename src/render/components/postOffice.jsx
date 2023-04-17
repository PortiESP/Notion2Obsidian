

export default function postOffice(tag, data){

    const isDev = location.host === "localhost:6969"  // Actally send IPC if we are not on `npm run dev`

    console.log("Sending message ["+tag+"]: " + data)
    if (!isDev){
        const {ipcRenderer} = window.require("electron")
        ipcRenderer.send(tag, data)
    }

}