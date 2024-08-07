const { processState, flushData, writeTOPortArray } = require('../serialport');
const { resetProcessPrompt, sleep } = require('../lib/utils');
const { resetCanvas } = require('../lib/canvas');
const { setTogglesIfAdmin } = require('../admin/admin');
const { disableButtons } = require('../buttons');
const { CONFIG_DATA } = require('../lib/excelReader');
const { offBins } = require('../bins');

const resetButton = document.getElementById('resetButton'),
    processStep = document.getElementById('processStep'),
    actualCycleTime = document.getElementById('actualCycleTime'),
    targetCycleTime = document.getElementById('targetCycleTime'),
    commandLine = document.getElementById('instructions'),
    selectDeskManual = document.getElementById('selectDeskManual'),
    selectDeskScanner = document.getElementById('selectDeskScanner'),
    startButton = document.getElementById('startButton'),
    allImage = document.getElementById('allImage'),
    canvas = document.getElementById('canvas');

const isStartEnabled = CONFIG_DATA[7].__EMPTY_9.toUpperCase() === 'ENABLE';

async function resetProcess(isResetClicked = false, targetAchieved = false) {
    if (isResetClicked) {
        const res = await resetProcessPrompt();
        if (res === null) {
            return;
        }
        writeTOPortArray([1, processState.process[2] + 2, processState.process[3], processState.process[4]]);
        await sleep(100);
        await offBins();
    }
    resetCanvas();
    processState.toStopTesting = true;
    processState.stop = true;
    processState.totalSeconds = 0;
    processState.excel = {
        row: -1,
        data: [],
        filename: '',
        minutes: 0,
        seconds: 0,
    };
    processStep.textContent = '0';
    actualCycleTime.value = '-';
    targetCycleTime.value = '-';
    commandLine.textContent = '';
    selectDeskManual.disabled = false;
    selectDeskScanner.disabled = false;
    allImage.innerHTML = '';
    allImage.style.display = 'block';
    canvas.style.display = 'none';
    flushData();
    if (processState.buzzerOn) {
        writeTOPortArray([1, 103, 128, 128]);
        processState.buzzerOn = false;
    }
    writeTOPortArray([1, 96, 128, 128]);
    disableButtons(true);
    setTogglesIfAdmin();
    clearTimeout(processState.interval.targetCycle);
    clearInterval(processState.interval.externalButton);
    clearInterval(processState.interval.actualCycle);
    enableStartIfConfig(isResetClicked, targetAchieved);
}

resetButton.onclick = resetProcess;

async function enableStartIfConfig(isResetClicked, targetAchieved) {
    if (!targetAchieved) {
        if (!isResetClicked && isStartEnabled) {
            const { runTests } = require('../renderConImage');
            if (selectDeskScanner.style.display !== 'none') {
                await runTests(selectDeskScanner);
            } else {
                await runTests(selectDeskManual);
            }
            return;
        }
    }
    startButton.disabled = true;
    selectDeskManual.value = ' ';
    selectDeskScanner.value = '';
    selectDeskScanner.focus();
}

module.exports = {
    resetProcess,
};
