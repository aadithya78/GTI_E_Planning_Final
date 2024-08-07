const sizeof = require('image-size');
const { readFileSync } = require('node:fs');
const { createElement, readJson, createOptionElements } = require('./utils');
const { excelReader } = require('./excelReader');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const { width, height } = document.querySelector('canvas');

const folderName = document.getElementById('folderName');
const imageName = document.getElementById('imageName');
const disablePoint = document.getElementById('disablePoint');
const saveButton = document.getElementById('saveButton');
const selectPin = document.getElementById('selectPin');

const ANGLE = Math.PI;
const pointsObject = {
    points: [],
};

const imgCache = {};

const configData = excelReader('./config/config.xlsx');

/**
 * onclick event handler for the canvas element which draws a circle on the canvas
 */
const drawCircleOnCanvas = ({ x, y, radius, c1, c2, text, tc, size }) => {
    context.beginPath();
    context.fillStyle = tc;
    context.lineWidth = 5;
    context.strokeStyle = c2;
    context.font = context.font.replace(/\d+/, size);
    context.arc(x, y, radius, 0, ANGLE);
    context.fillText(text, x - radius / 2, y);
    context.stroke();
    context.beginPath();
    context.strokeStyle = c1;
    context.arc(x, y, radius, ANGLE, ANGLE * 2);
    context.stroke();
};

/**
 * onload event handler for the canvas element which draws resets the canvas and draws
 * the image on the canvas
 * @param {ProgressEvent<FileReader>} e Progress event
 * @param {number} imgWidth width of the image
 * @param {number} imgHeight height of the image
 */
const onLoadReader = (e, imgWidth, imgHeight) => {
    const img = new Image(imgWidth, imgHeight);
    resetCanvas();
    img.onload = () => {
        if (imgWidth < width && imgHeight < height) {
            context.drawImage(img, 0, 0);
            return;
        }
        context.drawImage(img, 0, 0, imgWidth, imgHeight, 0, 0, width, height);
    };
    img.src = e.target.result;
};

/**
 * onchange event handler for the canvas element which draws the image on the canvas
 * @param {string} image value array of objects with the file name
 */
const setImage = (image) => {
    const { width, height } = sizeof(image);
    const reader = new FileReader();
    reader.onload = (e) => onLoadReader(e, width, height);
    reader.readAsDataURL(new Blob([image]));
};

/**
 * get the image from the folder
 * @param {string} value name of the image
 * @return {Buffer} image
 * @throws {Error} if the image is not found
 */
const getImage = (value) => {
    const path = `./images/${folderName.value}/${value}`;
    if (!imgCache[path]) {
        try {
            imgCache[path] = readFileSync(path);
        } catch (e) {
            console.error(e);
        }
    }
    return imgCache[path];
};

/**
 * render the circles on the canvas from the points array
 * @param {Array} points array
 */
const renderAllPoints = (points) => {
    disablePoint.innerHTML = '';
    points.forEach((point, i) => {
        if (point) {
            const { text } = point;
            drawCircleOnCanvas(point);
            appendDeletePoint(text, i);
        }
    });
};

/**
 * reset the canvas
 */
const resetCanvas = () => {
    context.clearRect(0, 0, width, height);
};

/**
 * method to run if the point exists in the array
 */
const pointExists = () => {
    resetCanvas();
    const image = getImage(imageName.value);
    setImage(image);
    setTimeout(() => {
        renderAllPoints(pointsObject.points);
    }, 50);
};

/**
 * read the json data from the file and render the circles on the canvas
 * @param {string} filename name of the file
 */
const readAndRenderPoints = (filename) => {
    setTimeout(() => {
        pointsObject.points = readJson(`${folderName.value}/${filename}`);
        renderAllPoints(pointsObject.points);
    }, 50);
};

const appendDeletePoint = (text, i) => {
    const option = createElement('option', text);
    option.textContent = text + ' ~ ' + i;
    disablePoint.appendChild(option);
};

/**
 * set image on the canvas if image size is not too large
 * @param {InputEvent} e
 */
const onImageChange = (e) => {
    pointsObject.points = [];
    saveButton.disabled = false;
    document.getElementById('deleteButton').disabled = false;
    const { value } = e.target;
    const image = getImage(value);
    setImage(image);
    const conName = value.split('.')[0];
    getTotalPins(conName);
    return readAndRenderPoints(conName);
};

/**
 * get the total pins from the config file
 * @param {string} conName file name
 * @return {void} void
 */
const getTotalPins = (conName) => {
    const totalPinsNumber = configData.find(
        ({ __EMPTY }) => __EMPTY?.toUpperCase() === conName.toUpperCase()
    ).__EMPTY_2;
    document.getElementById('totalPins').value = totalPinsNumber;

    createOptionElements(totalPinsNumber + 1, selectPin);
};

module.exports = {
    drawCircleOnCanvas,
    pointExists,
    pointsObject,
    readAndRenderPoints,
    readJson,
    renderAllPoints,
    resetCanvas,
    setImage,
    onImageChange,
    appendDeletePoint,
    ANGLE,
};
