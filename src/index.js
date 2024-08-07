const { app, Menu } = require('electron');
const { createWindow } = require('./browserwindows');
const { CONFIG_DATA } = require('./lib/excelReader.js');
app.on('ready', () => {
    const win = createWindow();
    win.fullScreen = true
    // win.webContents.openDevTools();
    Menu.setApplicationMenu(new Menu());

    const log_value = CONFIG_DATA[9]['__EMPTY_6'];

});
require('@electron/remote/main').initialize();
require('./server/index');
require('./database/PlanningDB.js');

app.on('window-all-closed', app.quit);
