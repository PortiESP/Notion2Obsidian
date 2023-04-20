

export function postOfficeSend(tag, data){

    const isDev = location.host === "localhost:6969"  // Actally send IPC if we are not on `npm run dev`

    console.log("Sending message ["+tag+"]: " + data)

    if (!isDev){
        const {ipcRenderer} = window.require("electron") 
        ipcRenderer.send(tag, data)
    } else {
        console.warn("Messages are not being sent in 'dev' mode")
    }

}


export function postOfficeSendCBK(tag, data, callback){

    const isDev = location.host === "localhost:6969"  // Actally send IPC if we are not on `npm run dev`

    console.log("Sending message with callback ["+tag+"]: " + data)

    if (!isDev){
        const {ipcRenderer} = window.require("electron")
        ipcRenderer.invoke(tag, data).then( res => callback(res) )
    } else {
        console.warn("Messages are not being sent in 'dev' mode")
    }

}


export function postOfficeSendAndListen(tag, data, responseCode, callback){

    const isDev = location.host === "localhost:6969"  // Actally send IPC if we are not on `npm run dev`

    console.log("Sending message and setup listener ["+tag+"]: " + data, " - Listening on: ["+responseCode+"]")

    if (!isDev){
        const {ipcRenderer} = window.require("electron")
        ipcRenderer.on(responseCode, callback)
        ipcRenderer.send(tag, data)
    } else {
        console.warn("Messages are not being sent in 'dev' mode")
    }

}