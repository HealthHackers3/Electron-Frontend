const { contextBridge, ipcRenderer} = require('electron');
let userId = null;
let port = null; // Add a variable to store the port

// Expose safe Electron API to the renderer process
contextBridge.exposeInMainWorld('electron', {
    sendMessage: (channel, data) => ipcRenderer.send(channel, data),
    onMessage: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
    getUserId: () => userId, // Function to retrieve the userId
    setUserId: (id) => { userId = id; }, // Function to set the userId
    getPort: () => port, // Function to retrieve the port
    setPort: (newPort) => { port = newPort; }, // Function to set the port
    minimizeWindow: () => ipcRenderer.send('window-control', 'minimize'),
    maximizeWindow: () => ipcRenderer.send('window-control', 'maximize'),
    closeWindow: () => ipcRenderer.send('window-control', 'close'),
});

