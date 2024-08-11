const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) =>{
            ipcRenderer.send(channel, data)
        },
        receive: (channel, func) => {
            ipcRenderer.on(channel, (events, ...args) => func(...args))
        }
    }
)
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }
// })
