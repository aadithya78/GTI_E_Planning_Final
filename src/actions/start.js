const { writeTOPortArray, processState, readFromPort, flushData } = require('../serialport');
const { disableButtons, disableTogglesOnStart } = require('../buttons');
const { sendCommand } = require('./send');
const { closeCylinder } = require('../lib/cylinder');
const { offBins } = require('../bins');
const { sleep } = require('../lib/utils');

async function startProcess() {
    document.getElementById('selectDeskManual').disabled = true;
    document.getElementById('selectDeskScanner').disabled = true;
    document.getElementById('allImage').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    flushData();
    closeCylinder();
    processState.stop = false;
    clearInterval(processState.interval.externalButton);
    writeTOPortArray([1, 98, 128, 128]);
    await sleep(500);
    disableTogglesOnStart();
    disableButtons(false);
    sendCommand();
}

function startExternalButton() {
    return setInterval(() => {
        const data = readFromPort();
        if (data == null) return;
        if (data[0] === 106) {
            startProcess();
        }
    }, 200);
}

document.getElementById('startButton').onclick = startProcess;
module.exports = {
    startProcess,
    startExternalButton,
};
