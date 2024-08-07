const { CONFIG_DATA } = require('./lib/excelReader');
const { SerialPort } = require('serialport');
port = new SerialPort({
    path: `COM${CONFIG_DATA[1]['__EMPTY_9']}`,
    baudRate: 9600,
});
