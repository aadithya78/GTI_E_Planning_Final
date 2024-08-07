const { getDirectories } = require('../lib/filesOperations');
const { printBarcode, generateBarcode } = require('./printer');

const processName = document.getElementById('processName');

getDirectories('./images', processName);

document.getElementById('printButton').onclick = (e) => {
    const { value } = processName;
    printBarcode(value, document.getElementById('barcode'));
};

document.getElementById('previewButton').onclick = (e) => {
    const { value: filename } = processName;
    const canvas = document.getElementById('barcode');
    generateBarcode(filename, canvas);
};
