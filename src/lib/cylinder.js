const { readFromPort, writeTOPortArray, flushData, processState } = require('../serialport');
const { sleep } = require('./utils');

async function openCylinder() {
    if (processState.appType === 'BONDER') return;
    if (processState.buttonsState.cyjMovement) {
        flushData();
        writeTOPortArray([1, 104, 128, 128]);
    }
}

async function openCylinderInterval() {
    if (processState.appType === 'BONDER') return;
    if (!processState.buttonsState.cyjMovement) return;
    while (processState.toStopTesting === false) {
        if (readFromPort()?.[0] === 106) {
            return;
        }
        await sleep(200);
    }
}

function closeCylinder() {
    if (processState.appType === 'BONDER') return;
    if (processState.buttonsState.cyjMovement) {
        writeTOPortArray([1, 105, 128, 128]);
    }
}

module.exports = {
    openCylinder,
    closeCylinder,
    openCylinderInterval,
};
