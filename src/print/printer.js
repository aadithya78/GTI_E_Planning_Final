const jsBarcode = require('jsbarcode');
const { jsPDF } = require('jspdf');
const { print } = require('pdf-to-printer');
const html2canvas = require('html2canvas');

/**
 * @param {string} filename
 * @param {HTMLCanvasElement} canvas
 */
async function generateBarcode(filename, canvas) {
    createBarCode(filename, canvas);
    const d = new Date(document.getElementById('datetime').value || Date.now());
    document.getElementById('displayDate').textContent = d.toLocaleDateString();
    document.getElementById('displayTime').textContent = d.toLocaleTimeString();
    document.getElementById('code1').textContent = document.getElementById('code1Input').value;
}

/**
 * function to generate pdf and print it.
 * @param {string} filename
 * @param {HTMLCanvasElement | null} canvas
 */
async function printBarcode(filename, canvas) {
    canvas ??= document.createElement('canavs', { width: 200, height: 100 });
    createBarCode(filename, canvas);
    const c = await html2canvas(document.getElementById('preview'));

    const pdf = new jsPDF({
        format: [25, 25],
        unit: 'mm',
        orientation: 'p',
    });

    pdf.setFontSize(4);
    pdf.addImage(c, 'PNG', 1, 8, 24, 12);
    pdf.save(`${filename}.pdf`);
    print(`${filename}.pdf`);
}

/**
 * Create barcode and save it to canvas
 * @param {string} filename
 * @param {HTMLCanvasElement} canvas
 */
function createBarCode(filename, canvas) {
    jsBarcode(canvas, filename, {
        format: 'CODE128',
        displayValue: true,
        fontOptions: 'bold',
        font: 'monospace',
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 2,
        fontSize: 20,
        background: '#ffffff',
        lineColor: '#000000',
    });
}

module.exports = {
    printBarcode,
    generateBarcode,
};
