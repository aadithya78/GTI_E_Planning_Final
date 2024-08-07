const { processState, writeTOPortArray } = require('../serialport');
const { endProcess } = require('./end');
const { commands } = require('../lib/constants/pins');
const { PINS } = require('../lib/constants/pins');
const { renderImage } = require('./renderImage');

const commandLine = document.getElementById('instructions');
const processStepIndicatior = document.getElementById('processStep');

function isExtraPinTypes() {
    const {
        pin: { type },
    } = processState;
    return type.includes('S-STICK') || type.includes('E-CON');
}

async function sendCommand() {
    const row = ++processState.excel.row;
    let currentExcelRowData = processState.excel.data[row];
    if (!currentExcelRowData) {
        return endProcess();
    }
    setCurrentRowData(currentExcelRowData);
    processStepIndicatior.textContent = row + 1;
    if (!isExtraPinTypes()) {
        processState.process[2] = commands[processState.pin.name];
        writeTOPortArray([...Object.values(processState.process)]);
    } else {
        processState.process[2] = 106;
    }
    return renderImage(currentExcelRowData['__EMPTY_1']);
}

function setCurrentRowData(data) {
    const type = data['__EMPTY'].toUpperCase();
    processState.pin = {
        type,
        name: type.substring(0, 3),
    };
    if (!isExtraPinTypes()) {
        processState.process[3] = PINS[processState.pin.name][processState.pin.type.split('-')[1]];
    }
    processState.process[4] = data['__EMPTY_1'] + 128;
    commandLine.textContent = data['__EMPTY_4'] || 'No Instruction';
}

module.exports = {
    sendCommand,
};
