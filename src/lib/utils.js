const { readFileSync, writeFile } = require('node:fs');
const prompt = require('electron-prompt');

/**
 * create an new element and return it with innerHTML as the value passed in
 * @param {string} htmlElement html element tag name to create
 * @param {string} value innerHMTL of the element
 * @param {string} className class name of the element defaults to empty string
 * @param {string} id id of the element defaults to empty string
 * @return {HTMLElement} new html element
 */
function createElement(htmlElement, value, className = '', id = '') {
    const element = document.createElement(htmlElement);
    element.innerHTML = value;
    className && (element.className = className);
    id && (element.id = id);
    return element;
}

function writeJson(data) {
    const folderName = document.getElementById('folderName').value;
    const imageName = document.getElementById('imageName').value.split('.')[0];
    writeFile(`./images/${folderName}/${imageName}.json`, JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

/**
 * read json data from the file and return the data
 * @param {string} fileName name of the file
 * @return {Arrray} data from the file
 */
function readJson(fileName) {
    try {
        const data = readFileSync(`./images/${fileName}.json`);
        return JSON.parse(data);
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * sleep for a given time in milliseconds
 * @param {number} ms time in milliseconds
 * @return {Promise} promise that resolves after the time
 * @example
 * await sleep(1000);
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 *
 */
async function resetProcessPrompt() {
    return prompt({
        title: 'Reset Process',
        label: 'Are you sure you want to reset the process?',
        type: 'input',
        inputAttrs: {
            type: 'hidden',
        },
        buttonLabels: { ok: 'Yes', cancel: 'No' },
    });
}

/**
 * create option elements for the select element and append them to the select element.
 * It clears the select element before appending the new options
 * @param {number} totalPinsNumber total number of pins
 * @param {HTMLSelectElement} selectElement select element to append the options
 * @return {void} void
 */
function createOptionElements(totalPinsNumber, selectElement) {
    selectElement.innerHTML = '';
    for (let i = 1; i < totalPinsNumber; i++) {
        const option = createElement('option', i.toString());
        selectElement.appendChild(option);
    }
}

function getFilename() {
    if (document.getElementById('selectDeskManual').style.display === 'none') {
        return document.getElementById('selectDeskScanner').value;
    }
    return document.getElementById('selectDeskManual').value;
}

module.exports = {
    createElement,
    readJson,
    writeJson,
    sleep,
    resetProcessPrompt,
    createOptionElements,
    getFilename,
};
