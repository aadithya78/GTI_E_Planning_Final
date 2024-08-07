const { createElement, sleep } = require('../lib/utils');
const { test, letter, onClickRunning } = require('./state');
const { writeTOPortArray, readFromPort } = require('../serialport');
const { PINS } = require('../lib/constants/pins');

const tabs = document.getElementById('tabs');
const spans = tabs.getElementsByTagName('span');
const tableRow = document.getElementById('binTableTbody');

const onBinClick = async (e) => {
    if (!test.isSequenceCompleted) return;
    if (test.isClickRunning) {
        const toContinue = await onClickRunning();
        if (!toContinue) return;
    }
    test.isClickRunning = true;
    test.isDoubleBin = !!document.getElementById('doubleBin').checked;
    const previousSibling = e.target.previousSibling.previousSibling;
    const command = test.isDoubleBin ? 70 : 69;
    const [_, _binLetter, pinNumber] = previousSibling.previousSibling.textContent.split('-');
    const binLetter = test.isDoubleBin ? letter[_binLetter] : _binLetter;
    writeTOPortArray([1, command, PINS.BIN[binLetter], +pinNumber + 128]);
    runBinSequenceClick(e, command, binLetter, pinNumber);
};

const runBinSequenceClick = async (e, command, binLetter, pinNumber) => {
    while (test.isClickRunning) {
        if (readFromPort()?.[0] === command) {
            if (test.isDoubleBin) {
                doubleBinClick('1', 'green', binLetter, pinNumber);
                test.isClickRunning = false;
                return;
            }
            e.target.textContent = '1';
            e.target.style.backgroundColor = 'green';
            test.isClickRunning = false;
            return;
        }
        if (test.isDoubleBin) {
            doubleBinClick('0', 'red', binLetter, pinNumber);
        } else {
            e.target.textContent = '0';
            e.target.style.backgroundColor = 'red';
        }
        await sleep(200);
    }
};

const doubleBinClick = (num, color, binLetter, pinNumber) => {
    [...document.getElementsByClassName(`BIN-${binLetter}-${pinNumber}`)].forEach(({ firstChild }) => {
        firstChild.nextSibling.nextSibling.nextSibling.textContent = num;
        firstChild.nextSibling.nextSibling.nextSibling.style.backgroundColor = color;
    });
};

const createBinTableBodyCells = (tr, cells) => {
    for (let j = 1; j <= cells; j++) {
        const td = createElement('td', '', 'table-cell');
        if (j === 1) {
            td.classList.add('bin-status');
        } else if (j === 3) {
            td.onclick = onBinClick;
        }
        tr.appendChild(td);
    }
    return tr;
};

const createBinTableBody = (rows, element, name, cname) => {
    const binNumbers = document.getElementById(rows).value;
    for (let j = 1; j <= binNumbers; j++) {
        const tr = createElement('tr', `BIN-${name}-${j}`, `table-row BIN-${cname || name}-${j} tab-${cname || name}`);
        const trWithCells = createBinTableBodyCells(tr, 3);
        element.appendChild(trWithCells);
    }
};

const testBins = async () => {
    test.passsedBins = {
        A: [],
        B: [],
        C: [],
        D: [],
    }
    test.isSequenceCompleted = false;
    const statuses = document.getElementsByClassName('bin-status');
    for (const status of statuses) {
        let time = 2;
        const [_, binLetter, pinNumber] = status.previousSibling.textContent.split('-');
        writeTOPortArray([1, 65, PINS.BIN[binLetter], +pinNumber + 128]);
        changeTabs(letter[binLetter]);
        while (time--) {
            if (readFromPort()?.[0] === 65) {
                changeBinTextSequence(status, 'ON', '1', 'green');
                test.passsedBins[binLetter].push(+pinNumber + 128);
                break;
            }
            changeBinTextSequence(status, 'OFF', '0', 'red');
            await sleep(150);
        }
    }
    test.isSequenceCompleted = true;
};

/**
 * method to change the innerHTML according to the status of the bin in `sequence`
 * @param {HTMLElement} element
 * @param {'ON' | 'OFF'} text
 * @param {'1' | '0'} num
 * @param {'green' | 'red'} color
 */
const changeBinTextSequence = (element, text, num, color) => {
    element.textContent = text;
    element.nextSibling.textContent = num;
    element.style.backgroundColor = color;
};

const changeTabs = (letter) => {
    [...tableRow.getElementsByTagName('tr')].forEach((tr) => {
        tr.style.display = 'none';
    });
    [...document.getElementsByClassName(`tab-${letter}`)].forEach((tr) => {
        tr.style.display = 'inline-table';
    });
    changeTabsColor(document.getElementById(`tab-${letter}`));
};

const onSpanClick = ({ target }) => {
    const { textContent } = target;
    changeTabs(textContent);
    changeTabsColor(target);
};

const changeTabsColor = (element) => {
    [...spans].forEach((span) => {
        span.style.backgroundColor = '#f0bb9b';
    });
    element.style.backgroundColor = '#ea742c';
};

[...spans].forEach((span) => {
    span.onclick = onSpanClick;
});

const createBinTableBodys = () => {
    tableRow.innerHTML = '';
    [...document.getElementsByClassName('tab-A')].forEach((tr) => {
        tr.style.display = 'inline-table';
    });
    createBinTableBody('binANumbers', tableRow, 'A');
    createBinTableBody('binANumbers', tableRow, 'E', 'A');
    createBinTableBody('binBNumbers', tableRow, 'B');
    createBinTableBody('binBNumbers', tableRow, 'F', 'B');
    createBinTableBody('binCNumbers', tableRow, 'C');
    createBinTableBody('binCNumbers', tableRow, 'G', 'C');
    createBinTableBody('binDNumbers', tableRow, 'D');
    createBinTableBody('binDNumbers', tableRow, 'H', 'D');
};

const offAllBins = async () => {
    const binANumbers = document.getElementById('binANumbers').valueAsNumber;
    const binBNumbers = document.getElementById('binBNumbers').valueAsNumber;
    const binCNumbers = document.getElementById('binCNumbers').valueAsNumber;
    const binDNumbers = document.getElementById('binDNumbers').valueAsNumber;

    for (let i = 1; i <= binANumbers; i++) {
        writeTOPortArray([1, 72, PINS.BIN.A, i + 128]);
        await sleep(25);
    }
    for (let i = 1; i <= binBNumbers; i++) {
        writeTOPortArray([1, 72, PINS.BIN.B, i + 128]);
        await sleep(25);
    }
    for (let i = 1; i <= binCNumbers; i++) {
        writeTOPortArray([1, 72, PINS.BIN.C, i + 128]);
        await sleep(25);
    }
    for (let i = 1; i <= binDNumbers; i++) {
        writeTOPortArray([1, 72, PINS.BIN.D, i + 128]);
        await sleep(25);
    }
};

const testBinSequence = async (letter) => {
    document.getElementById('uploadConfig').disabled = true;
    test.isSequenceCompleted = false;
    for (const pinNumber of test.passsedBins[letter]) {
        const command = test.isDoubleBin ? 70 : 69;
        writeTOPortArray([1, command, PINS.BIN[letter], pinNumber]);
        let time = 2;
        while (time--) {
            await sleep(100);

            if (readFromPort()?.[0] === command) {
                await sleep(500);
                writeTOPortArray([1, 72, PINS.BIN[letter], pinNumber]);
                await sleep(25);
            }
        }
    }

    document.getElementById('uploadConfig').disabled = false;
    test.isSequenceCompleted = true;
};

module.exports = {
    createBinTableBody,
    testBins,
    changeTabs,
    createBinTableBodys,
    offAllBins,
    testBinSequence,
};
