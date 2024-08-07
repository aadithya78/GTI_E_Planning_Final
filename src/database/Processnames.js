const fs = require('fs');
const path = require('path');

//----------------------------------------------------MAIN FOLDER-------------------------------------------

function getFolderNames(mainFolderPath) {
    try {
        const items = fs.readdirSync(mainFolderPath);
        const folderNames = items.filter(item => fs.statSync(path.join(mainFolderPath, item)).isDirectory());
        return folderNames;
    } catch (error) {
        console.error(`Error reading folder names: ${error}`);
        return [];
    }
}

function generateFolderHTML(folderNames) {
    let htmlList = '';
    folderNames.forEach(folderName => {
        htmlList += `<li><input type="radio" id="folder-${folderName}" name="folder" value="${folderName}">
                     <label for="folder-${folderName}">${folderName}</label></li>`;
    });
    return htmlList;
}

function appendFoldersToHTML(mainFolderPath) {
    const folderNames = getFolderNames(mainFolderPath);
    const htmlList = generateFolderHTML(folderNames);
    const folderListElement = document.getElementById('folderList');
    if (folderListElement) {
        folderListElement.innerHTML = htmlList;

        const radios = folderListElement.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    console.log(`Folder radio clicked: ${radio.value}`);
                    selectedFolder = radio.value;
                    
                    // Update machine list dynamically based on selected folder
                    appendMachinesToHTML();
                }
            });
        });
    } else {
        console.error('Element with id="folderList" not found in HTML.');
    }
}
const mainFolderPath = path.join(__dirname, '../../SERVER');
appendFoldersToHTML(mainFolderPath);

//----------------------------------------------------------LINE MACHINE NAMES----------------------------------

function getLineMachineFolderNames() {
    try {
        const machineFolderPath = path.join(__dirname, `../../SERVER/${selectedFolder}`);
        const machineItems = fs.readdirSync(machineFolderPath);
        const lineMachineFolders = machineItems.filter(machineItem => {
            const machineFilePath = path.join(machineFolderPath, machineItem);
            return fs.statSync(machineFilePath).isDirectory();
        });
        return lineMachineFolders;
    } catch (error) {
        console.error(`Error reading machine folder names: ${error}`);
        return [];
    }
}

function generateLineMachineHTML(machineFolderNames) {
    let machineHTMLList = '';
    machineFolderNames.forEach(machineFolderName => {
        machineHTMLList += `<li><input type="radio" id="machine-${machineFolderName}" name="machine" value="${machineFolderName}">
                             <label for="machine-${machineFolderName}">${machineFolderName}</label></li>`;
    });
    return machineHTMLList;
}

function appendMachinesToHTML() {
    if (!selectedFolder) {
        console.error('No folder selected.');
        return;
    }

    const machineFolderNames = getLineMachineFolderNames();
    const machineHTMLList = generateLineMachineHTML(machineFolderNames);
    const machineListElement = document.getElementById('MachineList');
    if (machineListElement) {
        machineListElement.innerHTML = machineHTMLList;

        const radios = machineListElement.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    console.log(`Machine radio clicked: ${radio.value}`);
                    selectedMachine = radio.value;   
                    // Update file list dynamically based on selected machine
                    appendFilesToHTML();
                }
            });
        });
    } else {
        console.error('Element with id="MachineList" not found in HTML.');
    }
}

//-----------------------------------------FILE-----------------------------------------------------------------

function getExcelFileNames() {
    try {
        const mainFolderPath = path.join(__dirname, `../../SERVER/${selectedFolder}/${selectedMachine}/process`);
        const items = fs.readdirSync(mainFolderPath);
        const excelFiles = items.filter(item => fs.statSync(path.join(mainFolderPath, item)).isFile() && path.extname(item) === '.xlsx');
        return excelFiles;
    } catch (error) {
        console.error(`Error reading file names: ${error}`);
        return [];
    }
}

function generateExcelHTML(fileNames) {
    let htmlList = '';
    fileNames.forEach(fileName => {
        const fileNameWithoutExt = path.parse(fileName).name;
        htmlList += `<li><input type="radio" id="file-${fileNameWithoutExt}" name="file" value="${fileNameWithoutExt}">
                     <label for="file-${fileNameWithoutExt}">${fileNameWithoutExt}</label></li>`;
    });
    return htmlList;
}

function appendFilesToHTML() {
    if (!selectedFolder || !selectedMachine) {
        console.error('No folder or machine selected.');
        return;
    }

    const fileNames = getExcelFileNames();
    const htmlList = generateExcelHTML(fileNames);

    const processListElement = document.getElementById('ProcessList');
    if (processListElement) {
        processListElement.innerHTML = htmlList;

        const radios = processListElement.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    console.log(`File radio clicked: ${radio.value}`);
                    selectedFile = radio.value;
                   
                }
            });
        });
    } else {
        console.error('Element with id="ProcessList" not found in HTML.');
    }
}