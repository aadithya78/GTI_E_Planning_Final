const { BrowserWindow } = require('electron');

let main = {
    /**
     * @type {BrowserWindow}
     */
    win: null,
};
function createWindow() {
    let win = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    win.loadFile('./test.html');

    win.on('closed', () => {
        win = null;
    });

    require('@electron/remote/main').enable(win.webContents);
    main.win = win;
} // Relevant discussion: https://github.com/electron/electron/issues/18397

module.exports = {
    main,
    createWindow,
};
