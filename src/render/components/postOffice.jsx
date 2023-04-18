

export default function postOffice(tag, data, callback=undefined){

    const isDev = location.host === "localhost:6969"  // Actally send IPC if we are not on `npm run dev`

    console.log("Sending message ["+tag+"]: " + data)
    if (!isDev){
        const {ipcRenderer} = window.require("electron")
        if (callback) ipcRenderer.invoke(tag, data).then( res => callback(res) )
        else ipcRenderer.send(tag, data)
    } else {
        console.warn("Messages are not being sent in 'dev' mode")
    }

}