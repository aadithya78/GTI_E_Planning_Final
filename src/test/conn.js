const { createElement, sleep } = require('../lib/utils');
const { test, onClickRunning } = require('./state');
const { writeTOPortArray, readFromPort } = require('../serialport');
const { PINS } = require('../lib/constants/pins');
const { connectors } = require('../actions/verify');

const table = document.getElementById('conTableTbody');
const createConTableBody = () => {
    const conNumbers = document.getElementById('connectors').value;
    table.innerHTML = '';
    for (let i = 1; i <= conNumbers; i++) {
        const tr = createElement('tr', `CON-${i}`);
        const trWithCells = createConTablebodyCells(tr, `CON-${i}`);
        table.appendChild(trWithCells);
    }
};

/**
 * method to create and append table body cells to the row
 * @param {HTMLTableRowElement} tr  table row element
 * @returns {HTMLTableRowElement} tr  table row element
 */
const createConTablebodyCells = (tr, name) => {
    const select = createElement('select');
    const option = createElement('option');
    for (let j = 1; j <= 4; j++) {
        const td = createElement('td', '', 'table-cell');
        if (j === 1) {
            td.classList.add('con-status');
        } else if (j === 4) {
            td.onclick = onConClick;
        }
        tr.appendChild(td);
    }
    tr.appendChild(createDropdown(select, option, connectors[name]));
    return tr;
};

/**
 * method to run test on the selected connector
 * @param {MouseEvent} e  event object
 * @returns {void}
 */
const onConClick = async (e) => {
    if (!test.isSequenceCompleted) return;

    if (test.isClickRunning) {
        const toContinue = await onClickRunning();
        if (!toContinue) return;
    }
    test.isClickRunning = true;

    const previousSibling = e.target.previousSibling.previousSibling.previousSibling;
    const [_, conNumber] = previousSibling.previousSibling.textContent.split('-');
    const pinNumber = e.target.nextSibling.value;
    if (pinNumber === 'sequence') {
        writeTOPortArray([1, 75, PINS.CON[conNumber], 228]);
    } else {
        writeTOPortArray([1, 75, PINS.CON[conNumber], +pinNumber + 128]);
    }
    runConSequenceClick(e);
};

const runConSequenceClick = async (e) => {
    if (!test.isSequenceCompleted) return;
    e.target.textContent = '0';
    e.target.style.backgroundColor = 'red';
    while (1) {
        if (readFromPort()?.[0] === 75) {
            e.target.textContent = '1';
            e.target.style.backgroundColor = 'green';
            test.isClickRunning = false;
            break;
        }
        await sleep(200);
    }
};
const createDropdown = (select, option, pins) => {
    const fragment = document.createDocumentFragment();
    const sequence = createElement('option', 'sequence');
    fragment.appendChild(sequence);
    for (let i = 1; i <= pins; i++) {
        option.textContent = `${i}`;
        fragment.appendChild(option.cloneNode(true));
    }
    select.appendChild(fragment);
    return select;
};

const testConnectors = async (command) => {
    test.isSequenceCompleted = false;
    const isS1 = command === 74;
    const statuses = document.getElementsByClassName('con-status');
    for (const status of statuses) {
        const conNumber = status.previousSibling.textContent.split('-')[1];
        changeConTextSq(status, 'OFF', '0', 'red', isS1);
        let expected = 74;
        if (!isS1) {
            expected = connectors[status.previousSibling.textContent];
        }
        let i = 3;
        while (i--) {
            writeTOPortArray([1, command, PINS.CON[conNumber], 128]);
            const data = readFromPort()?.[0];
            if (data != null) {
                i = 3;
                break;
            }
            await sleep(200);
        }
        if (i === -1) {
            continue;
        }
        if (readFromPort()?.[0] === expected) {
            writeTOPortArray([1, command, PINS.CON[conNumber], 128]);
        }

        while (i--) {
            const data = readFromPort()?.[0];
            if (data == null) {
                await sleep(200);
                continue;
            }
            if (data === expected) {
                changeConTextSq(status, 'ON', '1', 'green', isS1);
                break;
            } else if (!isS1) {
                changeConTextSq(status, 'OFF', '0', 'yellow', isS1);
                break;
            }
        }
    }
    test.isSequenceCompleted = true;
};

/**
 * method to change the innerHTML according to the status of the connector in sequence
 * @param {HTMLElement} element
 * @param {'ON' | 'OFF'} text
 * @param {'1' | '0'} num
 * @param {'green' | 'red'} color
 */
const changeConTextSq = (element, text, num, color, isS1 = false) => {
    if (isS1) {
        element.nextSibling.nextSibling.textContent = num;
    } else {
        element.nextSibling.textContent = num;
        element.textContent = text;
        element.style.backgroundColor = color;
    }
};

module.exports = {
    createConTableBody,
    onConClick,
    createDropdown,
    testConnectors,
};
