const { contextBridge, ipcRenderer } = require('electron');

// Expose safe Electron API to the renderer process
contextBridge.exposeInMainWorld('electron', {
    sendMessage: (channel, data) => ipcRenderer.send(channel, data),
    onMessage: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});
