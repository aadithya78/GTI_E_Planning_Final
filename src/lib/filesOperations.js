const { readdir } = require('node:fs');

const { createElement } = require('./utils');

/**
 * Get the list of directories at the given path and create a select element with the
 * directories
 * @param {string} path Path to the directory
 * @param {HTMLSelectElement} selectElement Select element to add the directories
 */
function getDirectories(path, selectElement) {
    readdir(path, { withFileTypes: true }, (e, dirs) => {
        if (e) {
            console.error(e);
            return;
        }
        dirs.filter((dirent) => dirent.isDirectory()).forEach((dir) => {
            const option = createElement('option', dir.name);
            selectElement.appendChild(option);
        });
        selectElement.value = ' ';
    });
}

function getImages(e, selectElement) {
    selectElement.innerHTML = '';
    const { value } = e.target;
    readdir(`./images/${value}`, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        files
            .filter((file) => {
                return (
                    file.name.toUpperCase().includes('CON') &&
                    (file.name.endsWith('.png') || file.name.endsWith('.jpg'))
                );
            })
            .forEach((file) => {
                const option = createElement('option', file.name);
                selectElement.appendChild(option);
            });
        selectElement.value = ' ';
    });
}

module.exports = {
    getDirectories,
    getImages,
};
