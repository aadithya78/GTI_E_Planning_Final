const { sleep } = require('./lib/utils');

require('./port');

const processState = {
    isPaused: false,
    stop: true,
    totalSeconds: 0,
    buzzerOn: false,
    toStopTesting: false,
    /**
     * @type {'BONDER' | 'NAVIGATOR_WITH_SENSOR' | 'NAVIGATOR_WITHOUT_SENSOR'}
     */
    appType: '',
    process: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
    },
    interval: {
        targetCycle: 0,
        externalButton: 0,
        actualCycle: 0,
    },
    excel: {
        row: -1,
        data: [],
        filename: '',
        minutes: 0,
        seconds: 0,
    },
    buttons: {
        previous: false,
        next: false,
    },
    pin: {
        /**
         * @type {'BIN' | 'CON'}
         */
        name: '',
        type: '',
    },
    bins: {
        glowing: false,
    },
    buttonsState: {
        /**
         * @type {'scanner' | 'manual'}
         */
        selectedDesk: 'scanner',
        timeElapsed: false,
        cyjMovement: false,
        warningAlarm: false,
    },
};

/**
 * @returns {Buffer | null} data
 */
const readFromPort = () => {
    const data = port.read();
    data && console.log(data);
    return data;
};

const closePort = async () => {
    if (port.isOpen) {
        await port.close();
        await sleep(50);
    }
};

const flushData = () => {
    while (1) {
        const data = readFromPort();
        if (data == null) {
            break;
        }
    }
};

/**
 * @param {number[]} array
 * @returns {void}
 */
const writeTOPortArray = (array) => {
    console.log(array);
    array.forEach((e) => {
        const data = new Uint8Array([e]);
        port.write(data);
    });
};

module.exports = {
    readFromPort,
    flushData,
    writeTOPortArray,
    processState,
    closePort,
};
