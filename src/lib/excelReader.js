const { existsSync } = require('node:fs');
const { readFile, utils } = require('xlsx');

/**
 * method to read excel file and return json object
 * @param {string} filePath path to be read by the reader
 * @returns {Array} array of json objects
 */
const excelReader = (filePath) => {
    if (!existsSync(filePath)) {
        //alert('File not found');
        return [];
    }
    const data = readFile(filePath);
    return utils.sheet_to_json(data.Sheets[data.SheetNames[0]]);
};

const CONFIG_DATA = excelReader('./config/config.xlsx');

module.exports = {
    excelReader,
    CONFIG_DATA,
};
