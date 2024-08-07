const { app } = require('electron');
const { main, createWindow } = require('./browserwindows');
require('./server/index');

app.on('ready', () => {
    createWindow();
    // main.win.webContents.openDevTools();
});
require('@electron/remote/main').initialize();

app.on('window-all-closed', app.quit);
