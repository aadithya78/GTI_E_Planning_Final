const {
    PINS: { BIN },
} = require('./lib/constants/pins');
const { sleep } = require('./lib/utils');
const { processState, writeTOPortArray } = require('./serialport');

async function glowBins() {
    if (processState.bins.glowing) return;
    processState.bins.glowing = true;
    const { data } = processState.excel;
    const bins = new Set(
        data.filter(({ __EMPTY: imgName }) => {
            return imgName.toUpperCase().startsWith('BIN');
        })
    );
    for (const bin of bins) {
        const number = bin.__EMPTY.split('.')[0].split('-')[1];
        writeTOPortArray([1, 68, BIN[number], bin.__EMPTY_1 + 128]);
        await sleep(25);
    }

    if (processState.appType === 'BONDER') {
        await sleep(1000);
    }
}

async function offBins() {
    const { data } = processState.excel;
    const bins = new Set(
        data.filter(({ __EMPTY: imgName }) => {
            return imgName.toUpperCase().startsWith('BIN');
        })
    );

    for (const bin of bins) {
        const number = bin.__EMPTY.split('-')[1];
        writeTOPortArray([1, 72, BIN[number], bin.__EMPTY_1 + 128]);
        await sleep(100);
    }
}

module.exports = {
    glowBins,
    offBins,
};
