(() => {
    const { writeTOPortArray, processState } = require('./serialport');
    const { isAdmin } = require('./admin/admin');
    const { sleep } = require('./lib/utils');

    const warningAlarmOnButton = document.getElementById('warningAlarmOnButton'),
        warningAlarmOffButton = document.getElementById('warningAlarmOffButton'),
        timeElapsedEnableButton = document.getElementById('timeElapsedEnableButton'),
        timeElapsedDisableButton = document.getElementById('timeElapsedDisableButton'),
        cyjMovementEnableButton = document.getElementById('cyjMovementEnableButton'),
        cyjMovementDisableButton = document.getElementById('cyjMovementDisableButton'),
        startButton = document.getElementById('startButton'),
        previousButton = document.getElementById('previousButton'),
        nextButton = document.getElementById('nextButton'),
        pauseButton = document.getElementById('pauseButton');

    warningAlarmOnButton.onclick = () => {
        writeTOPortArray([1, 100, 128, 128]);
        warningAlarmOnButton.classList.add('add-border');
        warningAlarmOffButton.classList.remove('add-border');
    };

    warningAlarmOffButton.onclick = async () => {
        writeTOPortArray([1, 101, 128, 128]);
        warningAlarmOffButton.classList.add('add-border');
        warningAlarmOnButton.classList.remove('add-border');
        const command = processState.isPaused || processState.stop ? 96 : 98;
        await sleep(100);
        writeTOPortArray([1, command, 128, 128]);
    };

    pauseButton.onclick = () => {
        const isPaused = !processState.isPaused;
        processState.isPaused = isPaused;
        [previousButton, nextButton, startButton].forEach((button) => (button.disabled = isPaused));
        if (isPaused) {
            pauseButton.textContent = 'Continue';
            writeTOPortArray([1, 96, 128, 128]);
        } else {
            pauseButton.textContent = 'Pause';
            writeTOPortArray([1, 98, 128, 128]);
        }
    };

    cyjMovementEnableButton.onclick = () => {
        cyjMovementEnableButton.classList.add('add-border');
        cyjMovementDisableButton.classList.remove('add-border');
        processState.buttonsState.cyjMovement = true;
    };

    cyjMovementDisableButton.onclick = () => {
        cyjMovementDisableButton.classList.add('add-border');
        cyjMovementEnableButton.classList.remove('add-border');
        processState.buttonsState.cyjMovement = false;
    };

    timeElapsedEnableButton.onclick = () => {
        timeElapsedEnableButton.classList.add('add-border');
        timeElapsedDisableButton.classList.remove('add-border');
        processState.buttonsState.timeElapsed = true;
    };

    timeElapsedDisableButton.onclick = () => {
        timeElapsedDisableButton.classList.add('add-border');
        timeElapsedEnableButton.classList.remove('add-border');
        processState.buttonsState.timeElapsed = false;
    };

    function disableTogglesOnStart() {
        timeElapsedEnableButton.disabled = true;
        timeElapsedDisableButton.disabled = true;
        cyjMovementEnableButton.disabled = true;
        cyjMovementDisableButton.disabled = true;
        startButton.disabled = true;
    }

    function disableButtons(toDisable) {
        previousButton.disabled = toDisable;
        nextButton.disabled = toDisable;
        pauseButton.disabled = toDisable;
    }

    previousButton.onclick = () => {
        if (!isAdmin) return;
        processState.buttons.previous = true;
    };

    nextButton.onclick = () => {
        if (!isAdmin) return;
        processState.buttons.next = true;
    };

    module.exports = {
        disableTogglesOnStart,
        disableButtons,
    };
})();
