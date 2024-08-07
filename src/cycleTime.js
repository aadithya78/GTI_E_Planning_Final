const { processState, writeTOPortArray, readFromPort } = require('./serialport');
const { sleep } = require('./lib/utils');

const targetCycleTime = document.getElementById('targetCycleTime');
const actualCycleTime = document.getElementById('actualCycleTime');

function actualCycleTimeInteval() {
    document.getElementById('pauseButton').disabled = false;
    processState.interval.actualCycle = setInterval(() => {
        const { isPaused, totalSeconds } = processState;
        while (isPaused) {
            return;
        }

        let minute = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds - minute * 60;
        if (minute < 10) minute = `0${minute}`;
        if (seconds < 10) seconds = `0${seconds}`;
        actualCycleTime.value = `${minute}:${seconds}`;
        
        // Check if actual time exceeds target time
        const [targetMinutes, targetSeconds] = targetCycleTime.value.split(':').map(Number);
        if (
            parseInt(minute) > targetMinutes || 
            (parseInt(minute) === targetMinutes && parseInt(seconds) > targetSeconds)
        ) {
            actualCycleTime.style.color = 'red';
        } else {
            actualCycleTime.style.color = ''; // Reset color if it doesn't match
        }

        ++processState.totalSeconds;
    }, 1000);
}

function setTargetCycleTimeout(minutes, seconds) {
    processState.interval.targetCycle = setTimeout(
        () => {
            writeTOPortArray([1, 102, 128, 128]);
            processState.buzzerOn = true;
        },
        (minutes * 60 + seconds) * 1000
    );
}

function setTargetCycleTime() {
    let { minutes, seconds } = processState.excel;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    targetCycleTime.value = minutes + ':' + seconds;
    if (processState.buttonsState.timeElapsed) {
        setTargetCycleTimeout(minutes, seconds);
    }
}

module.exports = {
    setTargetCycleTime,
    actualCycleTimeInteval,
};
