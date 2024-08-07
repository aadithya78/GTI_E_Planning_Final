const { BrowserWindow } = require('electron');

function createWindow() {
    let win = new BrowserWindow({
        // fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    win.loadFile('./src/admin/login.html');

    win.on('closed', () => {
        win = null;
    });

    require('@electron/remote/main').enable(win.webContents);
    return win;
} // Relevant discussion: https://github.com/electron/electron/issues/18397

module.exports = {
    createWindow,
};
