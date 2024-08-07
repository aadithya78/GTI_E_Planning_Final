require('../lib/dateTime.js');
const {
    resetCanvas,
    drawCircleOnCanvas,
    pointExists,
    pointsObject,
    ANGLE,
    onImageChange,
    appendDeletePoint,
} = require('../lib/canvas');
const { writeJson, createElement } = require('../lib/utils');
const { getDirectories, getImages } = require('../lib/filesOperations');

const canvas = document.querySelector('canvas');
const disablePoint = document.getElementById('disablePoint');
const pinName = document.getElementById('pinName');
const pointerSize = document.getElementById('pointerSize');
const selectPin = document.getElementById('selectPin');
const textSize = document.getElementById('textSize');
const circleColor1 = document.getElementById('circleColor1');
const circleColor2 = document.getElementById('circleColor2');
const textColor = document.getElementById('textColor');
const deleteButton = document.getElementById('deleteButton');
const previewCircle = document.getElementById('previewCircle');
const previewCircleContext = previewCircle.getContext('2d');
const folderNameSelect = document.getElementById('folderName');
const imageName = document.getElementById('imageName');
const error = document.getElementById('error');

/**
 * onclick event handler for the canvas element which draws the circle on the canvas
 * @param {MouseEvent} e Mouse event
 */
canvas.onclick = (e) => {
    if (folderNameSelect.value === '' || imageName.value === '') return;
    const { value: text } = pinName;
    error.style.visibility = 'hidden';
    if (text === '') {
        setTimeout(() => {
            error.style.visibility = 'visible';
        }, 100);
        return;
    }

    const { offsetX: x, offsetY: y } = e;
    const { points } = pointsObject;
    const { value: radius } = pointerSize;

    const { value: c1 } = circleColor1;
    const { value: c2 } = circleColor2;
    const { value: tc } = textColor;
    const { value: pinNumber } = selectPin;
    const { value: size } = textSize;
    const isPointExist = points[pinNumber];
    const point = { x: x * 1.25, y: y * 1.25, radius, text, c1, c2, tc, size };
    points[pinNumber] = point;
    if (isPointExist) {
        pointExists();
    } else {
        drawCircleOnCanvas(point);
        appendDeletePoint(text, pinNumber);
    }
    deleteButton.disabled = false;
};

pointerSize.onchange = ({ target }) => changePreviewSize(target.value);
document.getElementById('saveButton').onclick = (e) => {
    const { points } = pointsObject;
    writeJson(points);
    points.length = 0;
    e.target.disabled = true;
    resetValues();
    imageName.value = ' ';
};

selectPin.onclick = (e) => {
    const { value } = e.target;
    const { points } = pointsObject;
    const point = points[value];
    if (point) {
        pinName.value = point.text;
        pointerSize.value = point.radius;
        textSize.value = point.size;
        changePreviewSize(point.radius);
        return;
    }
    pinName.value = '';
};

const resetValues = () => {
    resetCanvas();
    changePreviewSize(10);
    pointerSize.value = 10;
    textSize.value = '8';
    disablePoint.innerHTML = '';
    pinName.value = '';
    deleteButton.disabled = true;
};

deleteButton.onclick = () => {
    const { value } = disablePoint;
    const { points } = pointsObject;
    const index = points.findIndex((point) => {
        const name = value.split('~')[0].trim();
        return point ? point.text === name : false;
    });
    points.splice(index, 1);
    pointExists();
};

const changePreviewSize = (value) => {
    const { width, height } = previewCircle;
    const x = width / 2;
    const y = height / 2;
    previewCircleContext.clearRect(0, 0, width, height);
    previewCircleContext.beginPath();
    previewCircleContext.arc(x, y, value, 0, ANGLE);
    previewCircleContext.lineWidth = 5;
    previewCircleContext.strokeStyle = circleColor2.value;
    previewCircleContext.stroke();
    previewCircleContext.beginPath();
    previewCircleContext.arc(x, y, value, ANGLE, ANGLE * 2);
    previewCircleContext.strokeStyle = circleColor1.value;
    previewCircleContext.stroke();
};

for (let i = 8; i <= 24; i++) {
    const option = createElement('option', i);
    textSize.appendChild(option);
}

getDirectories('./images', folderNameSelect);
changePreviewSize(35);
folderNameSelect.onchange = (e) => {
    resetValues();
    getImages(e, imageName);
};
imageName.onchange = (e) => {
    resetValues();
    onImageChange(e);
};
