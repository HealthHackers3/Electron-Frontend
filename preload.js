const { contextBridge, ipcRenderer } = require('electron');
let userId = null;
// Expose safe Electron API to the renderer process
contextBridge.exposeInMainWorld('electron', {
    sendMessage: (channel, data) => ipcRenderer.send(channel, data),
    onMessage: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
    getUserId: () => userId, // Function to retrieve the variable
    setUserId: (id) => { userId = id; }, // Function to set the variable
});
