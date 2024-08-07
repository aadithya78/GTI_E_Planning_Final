(() => {
    const { readFromPort, flushData, processState, writeTOPortArray } = require('./serialport'),
        { sendCommand } = require('./actions/send'),
        { sleep } = require('./lib/utils'),
        { CONFIG_DATA } = require('./lib/excelReader'),
        { PINS } = require('./lib/constants/pins');

    async function onPreviousButtonClick() {
        processState.buttons.previous = false;
        if (processState.appType === 'BONDER') {
            const currentRow = processState.excel.data[processState.excel.row];
            const rows = processState.excel.data.slice(0, processState.excel.row - 1);

            const binExists = rows.find((value) => {
                return value['__EMPTY'] + value['__EMPTY_1'] === currentRow['__EMPTY'] + currentRow['__EMPTY_1'];
            });
            if (binExists) {
                writeTOPortArray([1, 67, processState.process[3], processState.process[4]]);
                // return;
            }
        }
        flushData();
        await sleep(200);
        writeTOPortArray([1, processState.process[2] + 2, processState.process[3], processState.process[4]]);
        if (processState.appType === 'NAVIGATOR_WITHOUT_SENSOR') {
            navigatorWithoutSensorPrevious();
            await sleep(200);
            processState.excel.row -= 1;
        }
        processState.excel.row -= processState.excel.row > 0 ? 2 : 1;
        sendCommand();
    }

    async function onNextButtonClick() {
        processState.buttons.next = false;
        flushData();
        writeTOPortArray([
            1,
            processState.appType === 'BONDER' ? 67 : processState.process[2] + 2,
            processState.process[3],
            processState.process[4],
        ]);
        await sleep(200);
        if (processState.appType === 'NAVIGATOR_WITHOUT_SENSOR') {
            navigatorWithoutSensorNext();
            await sleep(200);
            processState.excel.row -= 1;
        }
        sendCommand();
    }

    setInterval(async () => {
        if (processState.stop) return void 0;
        if (processState.buttons.previous) {
            await onPreviousButtonClick();
            return void 0;
        }

        if (processState.buttons.next) {
            await onNextButtonClick();
            return void 0;
        }

        if (processState.isPaused) return void 0;

        const data = readFromPort();

        if (data == null) return void 0;

        if (data[0] === 107) {
            await onPreviousButtonClick();
            return void 0;
        }

        if (data[0] === processState.process[2]) {
            if (processState.appType === 'NAVIGATOR_WITH_SENSOR') {
                navigatorWithSensorResponse();
            } else if (processState.appType === 'NAVIGATOR_WITHOUT_SENSOR') {
                navigatorWithoutSensorResponse();
            }
            sendCommand();
        }

        return void 0;
    }, 200);

  // document.getElementById('expectedCount').value = CONFIG_DATA[6].__EMPTY_9;
  /* const quantity = 10;
   console.log(`The Config[6] Target quantity of Part number are ${quantity}`);
  document.getElementById('exectedCount').value = quantity; */

    function navigatorWithSensorResponse() {
        if (processState.pin.name === 'BIN') {
            writeTOPortArray([1, 72, processState.process[3], processState.process[4]]);
        }
    }

    function navigatorWithoutSensorResponse() {
        if (processState.pin.name !== 'CON') {
            return;
        }

        const rows = processState.excel.data.slice(0, processState.excel.row);
        for (const row of rows.reverse()) {
            if (!row['__EMPTY'].startsWith('BIN')) {
                return;
            }
            const binNumber = PINS['BIN'][row['__EMPTY'].split('-')[1]];

            writeTOPortArray([1, 72, binNumber, +row['__EMPTY_1'] + 128]);
        }
    }

    function navigatorWithoutSensorPrevious() {
        if (processState.pin.name !== 'CON') {
            return;
        }

        const rows = processState.excel.data.slice(0, processState.excel.row);
        let index = 0;
        for (const row of [...rows].reverse()) {
            if (row['__EMPTY'].startsWith('CON')) {
                break;
            }
            const binNumber = PINS['BIN'][row['__EMPTY'].split('-')[1]];

            index++;
            writeTOPortArray([1, 72, binNumber, +row['__EMPTY_1'] + 128]);
        }
        processState.excel.row -= index;
        if (processState.excel.row < 1) {
            processState.excel.row = 2;
        }
    }

    function navigatorWithoutSensorNext() {
        if (processState.pin.name !== 'CON') {
            return;
        }

        const rows = processState.excel.data.slice(0, processState.excel.row);
        let index = 0;
        for (const row of [...rows].reverse()) {
            if (row['__EMPTY'].startsWith('CON')) {
                break;
            }
            const binNumber = PINS['BIN'][row['__EMPTY'].split('-')[1]];

            index++;
            writeTOPortArray([1, 72, binNumber, +row['__EMPTY_1'] + 128]);
        }
        processState.excel.row += index;
        if (processState.excel.row > processState.excel.data.length) {
            processState.excel.row = processState.excel.data.length;
        }
    }
})();
