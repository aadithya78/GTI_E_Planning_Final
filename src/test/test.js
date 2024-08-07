const { readFileSync, writeFile } = require('node:fs');
const { closePort } = require('../serialport');
const { testBins, createBinTableBodys, offAllBins, testBinSequence } = require('./bin');
const { createConTableBody, testConnectors } = require('./conn');
const { connectors, bins } = require('../actions/verify');
const { CONFIG_DATA } = require('../lib/excelReader');

const uploadConfig = document.getElementById('uploadConfig');
const binANumbers = document.getElementById('binANumbers');
const binBNumbers = document.getElementById('binBNumbers');
const binCNumbers = document.getElementById('binCNumbers');
const binDNumbers = document.getElementById('binDNumbers');
const connectorsElement = document.getElementById('connectors');
const doubleBin = document.getElementById('doubleBin');

uploadConfig.onclick = async () => {
    uploadConfig.disabled = true;
    const values = {};
    values.binA = binANumbers.valueAsNumber;
    values.binB = binBNumbers.valueAsNumber;
    values.binC = binCNumbers.valueAsNumber;
    values.binD = binDNumbers.valueAsNumber;
    values.con = connectorsElement.valueAsNumber;
    values.db = doubleBin.checked;
    if (!verify(values)) {
        uploadConfig.disabled = false;
        return;
    }

    const buttons = document.getElementsByClassName('activeButtons sequence-test');
    for (const button of buttons) {
        button.disabled = true;
    }
    createConTableBody();
    createBinTableBodys();
    await testBins();
    await testConnectors(73);
    await testConnectors(74);
    writeFile('./test.json', JSON.stringify(values), (e) => {
        e && console.error(e);
    });
    uploadConfig.disabled = false;
    for (const button of buttons) {
        button.disabled = false;
    }
};

document.getElementById('resetButton').onclick = async () => {
    await offAllBins();
    await closePort();
    window.location.reload();
};

document.getElementById('closeButton').onclick = async () => {
    await offAllBins();
    await closePort();
    window.location.href = '../index.html';
};
(() => {
    const values = JSON.parse(readFileSync('./test.json'));
    binANumbers.valueAsNumber = values.binA;
    binBNumbers.valueAsNumber = values.binB;
    binCNumbers.valueAsNumber = values.binC;
    binDNumbers.valueAsNumber = values.binD;
    connectorsElement.valueAsNumber = values.con;
    doubleBin.checked = values.db;
})();

const verify = ({ con, binA, binB, binC, binD }) => {
    const connectorsWithoutEcon = Object.keys(connectors).filter((conn) => {
        return conn.startsWith('CON');
    });
    if (connectorsWithoutEcon.length < con) {
        alert(
            `Number of connectors does not match with config file! Config has ${connectorsWithoutEcon.length}, provided ${con}`
        );
        return false;
    }
    if (bins['BIN-A'] < binA) {
        alert(`Pin Number for BIN-A exceeds the Config! Max is ${bins['BIN-A']}`);
        return false;
    }
    if (bins['BIN-B'] < binB) {
        alert(`Pin Number for BIN-B exceeds the Config! Max is ${bins['BIN-B']}`);
        return false;
    }
    if (bins['BIN-C'] < binC) {
        alert(`Pin Number for BIN-C exceeds the Config! Max is ${bins['BIN-C']}`);
        return false;
    }
    if (bins['BIN-D'] < binD) {
        alert(`Pin Number for BIN-D exceeds the Config! Max is ${bins['BIN-D']}`);
        return false;
    }

    return true;
};

const testSequenceButtonAssignment = () => {
    const appType = CONFIG_DATA[14].__EMPTY_9.toUpperCase()
    if (appType !== 'NAVIGATOR_WITHOUT_SENSOR') return
    const buttons = document.getElementsByClassName('activeButtons sequence-test');
    for (const button of buttons) {
        button.style.visibility = 'visible';
        button.onclick = async () => {
            await testBinSequence(button.getAttribute('data-bin'));
        };
    }
};

(() => {
    testSequenceButtonAssignment();
})();
