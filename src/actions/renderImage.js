const { processState } = require('../serialport');
const { setImage, drawCircleOnCanvas } = require('../lib/canvas');
const { readJson, sleep } = require('../lib/utils');
const { readFileSync } = require('node:fs');
const path = require('node:path');

async function renderImage(pinNumber) {
    const { type } = processState.pin;
    const { filename } = processState.excel;
    let image, imagePath;
    const isBin = type.includes('BIN') || type.includes('S-STICK');
    if (isBin) {
        imagePath = path.join('./images', filename, `${type}-${pinNumber}.jpg`);
    } else imagePath = path.join('./images', filename, `${type}.jpg`);

    try {
        image = readFileSync(imagePath);
    } catch (error) {
        image = readFileSync(path.join(`./images/${filename}/no_image.jpg`));
    }
    setImage(image);
    if (isBin) return;
    const points = readJson(`${filename}/${type}`);
    const point = points[pinNumber];
    await sleep(50);
    drawCircleOnCanvas(point);
}

module.exports = {
    renderImage,
};
