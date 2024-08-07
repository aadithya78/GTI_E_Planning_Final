const fs = require('fs');
const path = require('path');

//----------------------------------------------------MAIN FOLDER-------------------------------------------
window.selectedFolder = null;
window.selectedMachine = null;
window.selectedFile = null;


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
        htmlList += `<li><input type="checkbox" id="${folderName}" name="folder" value="${folderName}">
                     <label for="${folderName}">${folderName}</label></li>`;
    });
    return htmlList;
}

function appendFoldersToHTML(mainFolderPath) {
    const folderNames = getFolderNames(mainFolderPath);
   /*  console.log('Folders inside the main folder:');
    folderNames.forEach(folderName => console.log(folderName)); */

    const htmlList = generateFolderHTML(folderNames);

    const folderListElement = document.getElementById('folderList');
    if (folderListElement) {
        folderListElement.innerHTML = htmlList;
        
        const checkboxes = folderListElement.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                if (checkbox.checked) {
                    console.log(`Folder checkbox clicked: ${checkbox.value}`);
                    // You can also store the value globally here
                    window.selectedFolder = checkbox.value;
                } else {
                    console.log(`Folder checkbox unchecked: ${checkbox.value}`);
                    // You can also reset the global value here
                    window.selectedFolder = null;
                }
                
            });
        });

    } else {
        console.error('Element with id="folderList" not found in HTML.');
    }
}
const mainFolderPath = path.join(__dirname, '../../SERVER');  // Adjust 'SERVER' to your target folder name
appendFoldersToHTML(mainFolderPath);



//----------------------------------------------------------LINE MACHINE NAMES----------------------------------
function getLineMachineFolderNames(machineFolderPaths) {
    try {
        const machineItems = fs.readdirSync(machineFolderPaths);
        const lineMachineFolders = machineItems.filter(machineItem => {
            const machineFilePath = path.join(machineFolderPaths, machineItem);
            return fs.statSync(machineFilePath).isDirectory();
        });
        return lineMachineFolders;
    } catch (error) {
        console.error(`Error reading folder names: ${error}`);
        return [];
    }
}

function generateLineMachineHTML(machineFolderNames) {
    let machineHTMLList = '';
    machineFolderNames.forEach(machineFolderName => {
        machineHTMLList += `<li><input type="checkbox" id="${machineFolderName}" name="machine" value="${machineFolderName}">
                             <label for="${machineFolderName}">${machineFolderName}</label></li>`;
    });
    return machineHTMLList;
}

function appendMachinesToHTML(machineFolderPaths) {
    const machineFolderNames = getLineMachineFolderNames(machineFolderPaths);
   /*  console.log('Line machine folders inside the main folder:');
    machineFolderNames.forEach(machineFolderName => console.log(machineFolderName)); */

    const machineHTMLList = generateLineMachineHTML(machineFolderNames);

    const machineListElement = document.getElementById('MachineList');
    if (machineListElement) {
        machineListElement.innerHTML = machineHTMLList;


        const checkboxes = machineListElement.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                if (checkbox.checked) {
                    console.log(`Machine checkbox clicked: ${checkbox.value}`);
                    // You can also store the value globally here
                    window.selectedMachine = checkbox.value;
                } else {
                    console.log(`Machine checkbox unchecked: ${checkbox.value}`);
                    // You can also reset the global value here
                    window.selectedMachine = null;
                }
            });
        });


    } else {
        console.error('Element with id="MachineList" not found in HTML.');
    }
}

const machineFolderPaths = path.join(__dirname, '../../SERVER/LINE1');  // Adjust 'lineMachines' to your target folder name
appendMachinesToHTML(machineFolderPaths);


//-----------------------------------------File-----------------------------------------------------------------

function getExcelFileNames(mainFolderPaths) {
    try {
        const items = fs.readdirSync(mainFolderPaths);
        const excelFiles = items.filter(item => fs.statSync(path.join(mainFolderPaths, item)).isFile() && path.extname(item) === '.xlsx');
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
        htmlList += `<li><input type="checkbox" id="${fileNameWithoutExt}" name="folder" value="${fileNameWithoutExt}">
                     <label for="${fileNameWithoutExt}">${fileNameWithoutExt}</label></li>`;
    });
    return htmlList;
}

function appendFilesToHTML(mainFolderPaths) {
    const fileNames = getExcelFileNames(mainFolderPaths);
   /*  console.log('Excel files inside the main folder:');
    fileNames.forEach(fileName => console.log(fileName)); */

    const htmlList = generateExcelHTML(fileNames);

    const processListElement = document.getElementById('ProcessList');
    if (processListElement) {
        processListElement.innerHTML = htmlList;

        // Add event listener to each checkbox
        const checkboxes = processListElement.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                if (checkbox.checked) {
                    console.log(`File checkbox clicked: ${checkbox.value}`);
                    // You can also store the value globally here
                    window.selectedFile = checkbox.value;
                } else {
                    console.log(`File checkbox unchecked: ${checkbox.value}`);
                    // You can also reset the global value here
                    window.selectedFile = null;
                }
            });
        });


    } else {
        console.error('Element with id="ProcessList" not found in HTML.');
    }
}
const mainFolderPaths = path.join(__dirname, '../../SERVER/LINE1/L1SUB1/process');  // Adjust 'process' to your target folder name
appendFilesToHTML(mainFolderPaths);




