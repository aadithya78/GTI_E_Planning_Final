const { CONFIG_DATA } = require('../lib/excelReader');
const { sleep } = require('../lib/utils');
const { writeTOPortArray, readFromPort } = require('../serialport');
const os = require('os');

const connectors = [...CONFIG_DATA]
    .splice(2)
    .filter((data) => {
        return data.__EMPTY?.toUpperCase().includes('CON');
    })
    .reduce((acc, { __EMPTY, __EMPTY_2 }) => {
        const name = __EMPTY.toUpperCase();
        return {
            ...acc,
            [name]: __EMPTY_2,
        };
    }, {});

const bins = [...CONFIG_DATA]
    .splice(2)
    .filter((data) => {
        return data.__EMPTY_5?.toUpperCase().startsWith('BIN');
    })
    .reduce((acc, { __EMPTY_5, __EMPTY_6 }) => {
        const name = __EMPTY_5.toUpperCase();
        return {
            ...acc,
            [name]: __EMPTY_6,
        };
    }, {});

function verify(data) {
    return data.every(({ __EMPTY: type, __EMPTY_1: pinNumber }) => {
        const t = type.toUpperCase();
        if (t.includes('CON')) {
            return connectors[t] >= pinNumber;
        }
        if (t.startsWith('BIN')) {
            return bins[t] >= pinNumber;
        }
        return t.includes('S-STICK');
    });
}

async function checkPort() {
    if (os.type() === 'Linux') return true;
    const portStatus = document.getElementById('portStatus');
    writeTOPortArray([1, 111, 128, 128]);
    let time = 0;
    while (time < 3) {
        if (readFromPort()?.[0] === 111) {
            writeTOPortArray([1, 96, 128, 128]);
            portStatus.textContent = 'Port Connected';
            portStatus.className = 'port-connected';
            return true;
        }
        time++;
        await sleep(200);
    }
    portStatus.textContent = 'Port Not Connected';
    portStatus.className = 'port-not-connected';
    document.getElementById('selectDeskScannerButton').disabled = true;
    document.getElementById('selectDeskManualButton').disabled = true;
    document.getElementById('selectDeskManual').disabled = true;
    document.getElementById('selectDeskScanner').disabled = true;
    return false;
}

module.exports = {
    verify,
    checkPort,
    connectors,
    bins,
};
