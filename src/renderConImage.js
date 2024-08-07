const { existsSync } = require('node:fs');
const { processState, writeTOPortArray, readFromPort, flushData } = require('./serialport');
const { startProcess, startExternalButton } = require('./actions/start');
const { setTargetCycleTime, actualCycleTimeInteval} = require('./cycleTime');
const { sleep } = require('./lib/utils');
const {
    PINS: { CON },
} = require('./lib/constants/pins');
const { CONFIG_DATA, excelReader } = require('./lib/excelReader');
const { openCylinder, openCylinderInterval } = require('./lib/cylinder');
const { verify } = require('./actions/verify');

const allImages = document.getElementById('allImage'),
    startButton = document.getElementById('startButton'),
    selectDeskManual = document.getElementById('selectDeskManual'),
    selectDeskScanner = document.getElementById('selectDeskScanner');

const isCheckConEnabled = CONFIG_DATA[5].__EMPTY_9.toUpperCase() === 'ENABLE';

function displayProcessImages(filename) {
    const { data } = processState.excel;
    allImages.innerHTML = '';
    const imageNames = new Set(
        data
            .filter(({ __EMPTY: imgName }) => imgName.toUpperCase().startsWith('CON'))
            .map(({ __EMPTY}) => `${__EMPTY}`)
    );
    imageNames.forEach((imageName) => {
        const outerSpan = document.createElement('span');
        const imageElement = document.createElement('img');
        const imagePath = `images/${filename}/${imageName}.jpg`;
        if (existsSync(imagePath)) {
            imageElement.src = `../../../${imagePath}`;
        } else {
            imageElement.src = `../../../images/${filename}/no_image.jpg`;
        }
        outerSpan.id = imageName;
        outerSpan.textContent = imageName;
        outerSpan.appendChild(imageElement);
        outerSpan.style.border = '2px solid red';
        allImages.appendChild(outerSpan);
    });
    return imageNames;
}

/**
 * This function is used to run the test for the selected process.
 * @param {Set<string>} images
 */
async function test(images) {
    if (!processState.stop) return void 0;
    startButton.disabled = true;
    selectDeskManual.disabled = true;
    selectDeskScanner.disabled = true;
    clearInterval(processState.interval.externalButton);
    flushData();
    await sleep(200);
    for (const image of images) {
        if (processState.toStopTesting) break;
        const imageElement = document.getElementById(image);

        const number = image.split('-')[1];
        while (1) {
            if (processState.toStopTesting) break;
            writeTOPortArray([1, 74, CON[number], 128]);
            if (readFromPort()?.[0] === 74) {
                imageElement.style.border = '2px solid green';
                flushData();
                break;
            }

            await sleep(1000);
        }
        await sleep(100);
    }
    return testPassed();
}

async function runTests(target) {
    processState.toStopTesting = false;
    target.disabled = true;
    clearInterval(processState.interval.externalButton);
    const { value: processName } = target;
    if (processName === '') return resetScannerTestEffects();
    const data = excelReader(`./process/${processName}.xlsx`);

    if (!data.length) return resetScannerTestEffects();

    processState.excel = {
        minutes: data[2].__EMPTY,
        seconds: data[2].__EMPTY_1,
        filename: processName,
        row: -1,
    };

    data.splice(0, 4);
    processState.excel.data = data;
    startButton.disabled = true;

    if (!verify(data)) {
        alert("Desk doesn't match with the configuration");
        selectDeskManual.value = ' ';
        return (target.disabled = false);
    }

    actualCycleTimeInteval();
    setTargetCycleTime();
    if (processState.appType === 'BONDER') {
        return testPassed();
    }
    await openCylinder();
    if (!isCheckConEnabled) {
        return testPassed();
    }
    const images = displayProcessImages(processName);
    await openCylinderInterval();
    if (processState.toStopTesting) {
        return resetScannerTestEffects();
    }
    await test(images);
}

async function runScannerTest() {
    selectDeskScanner.oninput = null;
    await sleep(1500);
    runTests(selectDeskScanner);
    selectDeskScanner.oninput = runScannerTest;
}

function resetScannerTestEffects() {
    selectDeskScanner.disabled = false;
    selectDeskScanner.value = '';
    selectDeskScanner.focus();
    processState.excel.data = [];
    processState.excel.filename = '';
    startButton.disabled = true;
}

function testPassed() {
    clearInterval(processState.interval.externalButton);
    startButton.disabled = false;
    if (processState.appType === 'BONDER') {
        startProcess();
    } else {
        processState.interval.externalButton = startExternalButton();
    }
}

module.exports = {
    runScannerTest,
    runTests,
};
