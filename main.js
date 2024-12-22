const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            webSecurity: false, // Disable web security to bypass CORS
        },
    });

    // Retry mechanism to wait for React dev server
    const reactDevUrl = 'http://localhost:3000';
    let retries = 0;
    const maxRetries = 5;

    function loadReactApp() {
        mainWindow.loadURL(reactDevUrl).catch(() => {
            retries++;
            if (retries < maxRetries) {
                console.log(`Retrying to connect to React dev server... (${retries})`);
                setTimeout(loadReactApp, 1000);
            } else {
                console.error('Failed to connect to React dev server.');
            }
        });
    }

    loadReactApp();
    mainWindow.webContents.openDevTools();
    mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

