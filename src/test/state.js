const prompt = require('electron-prompt');

const clickPrompt = async () => {
    return prompt({
        title: '',
        label: 'Are you sure to go next step?',
        type: 'input',
        inputAttrs: {
            type: 'hidden',
        },
        buttonLabels: {
            ok: 'Yes',
            cancel: 'No',
        },
    });
};

const onClickRunning = async () => {
    const res = await clickPrompt();
    if (res === null) {
        return false;
    }
    test.isClickRunning = false;
    clearTimeout(test.clickTimeout);
    return true;
};

const test = {
    isSequenceCompleted: false,
    isClickRunning: false,
    clickTimeout: 0,
    isDoubleBin: false,
    passsedBins: {
        A: [],
        B: [],
        C: [],
        D: [],
    },
};

module.exports = {
    test,
    letter: {
        A: 'A',
        B: 'B',
        C: 'C',
        D: 'D',
        E: 'A',
        F: 'B',
        G: 'C',
        H: 'D',
    },
    clickPrompt,
    onClickRunning,
};
