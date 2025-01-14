const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const treeKill = require('tree-kill');
const axios = require('axios');

// Store these globally
let mainWindow;
let childProcess;
let serverPort = null;

// Dynamically import get-port
async function importGetPort() {
    const getPortModule = await import('get-port');
    return getPortModule.default;
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 730,
        minWidth: 640,
        minHeight: 576,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            webSecurity: false,
        },
    });
    ipcMain.on('window-control', (event, action) => {
        if (!mainWindow) return;

        switch (action) {
            case 'minimize':
                mainWindow.minimize();
                break;
            case 'maximize':
                if (mainWindow.isMaximized()) {
                    mainWindow.unmaximize();
                } else {
                    mainWindow.maximize();
                }
                break;
            case 'close':
                mainWindow.close();
                break;
            default:
                break;
        }
    });
    const reactDevUrl = 'http://localhost:3000';
    mainWindow.loadURL(reactDevUrl).catch(() => {
        console.error('Failed to load React dev server.');
    });

    // mainWindow.webContents.openDevTools();
    mainWindow.setMenuBarVisibility(false);
}

async function findAvailablePort() {
    const getPort = await importGetPort();
    return await getPort({ port: Array.from({ length: 6000 }, (_, i) => 4000 + i) });
}

async function launchExecutableWithPort() {
    try {
        const port = await findAvailablePort();
        serverPort = port;
        console.log(`Available port found: ${port}`);

        const exePath = path.join(__dirname, '/lib/cellpose.exe');
        childProcess = spawn(exePath, [port]);

        childProcess.stdout.on('data', (data) => {
            console.log(`Executable STDOUT: ${data}`);
        });

        childProcess.stderr.on('data', (data) => {
            console.error(`Executable STDERR: ${data}`);
        });

        childProcess.on('close', (code) => {
            console.log(`Executable exited with code ${code}`);
        });

        return port;
    } catch (error) {
        console.error(`Error launching executable: ${error.message}`);
        return null;
    }
}

app.on('ready', async () => {
    try {
        const port = await launchExecutableWithPort();
        if (!port) throw new Error("Failed to launch executable.");

        createWindow();

        // Wait for the window to be ready before sending the port
        mainWindow.webContents.once('did-finish-load', () => {
            mainWindow.webContents.send('port', port);
        });
    } catch (error) {
        console.error(error.message);
        app.quit();
    }
});

const terminateFlaskServer = async () => {
    if (childProcess && serverPort) {
        console.log('Sending shutdown request to Flask server...');
        try {
            await axios.post(`http://127.0.0.1:${serverPort}/shutdown`);
            console.log('Shutdown request sent to Flask server.');
        } catch (error) {
            console.error('Failed to send shutdown request to Flask server:', error.message);
        }

        console.log('Terminating Flask server process...');
        treeKill(childProcess.pid, 'SIGTERM', (err) => {
            if (err) {
                console.error('Failed to kill Flask server process:', err);
            } else {
                console.log('Flask server process terminated.');
            }
        });
        childProcess = null;
    }
};

// Clean up on quit signals
app.on('before-quit', terminateFlaskServer);
app.on('will-quit', terminateFlaskServer);

// Combine your window-all-closed into one
app.on('window-all-closed', async () => {
    await terminateFlaskServer();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// OS-level signals
process.on('SIGINT', terminateFlaskServer);
process.on('SIGTERM', terminateFlaskServer);
