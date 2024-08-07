/* const { processState } = require('../serialport');
const { printBarcode } = require('../print/printer');
const { CONFIG_DATA } = require('../lib/excelReader');
const { resetProcess } = require('./reset');
const { offBins } = require('../bins');

const actualCount = document.getElementById('actualCount');
const expectedCount = document.getElementById('expectedCount');

const isPrintetEnabled = CONFIG_DATA[4].__EMPTY_9 === 'ENABLE';

async function endProcess() {
    isPrintetEnabled && printBarcode(processState.excel.filename, null);
    ++actualCount.value;
    await offBins();
    const targetAchieved = actualCount.value === expectedCount.value;
    if (targetAchieved) {
        alert('Target achieved!');
        actualCount.value = '0';
    }
    resetProcess(false, targetAchieved);
}

module.exports = {
    endProcess,
};*/

/* 
WORKING
function enableNextSequence() {
    const selectDeskManual = document.getElementById('selectDeskManual');
    const options = selectDeskManual.options;
    let foundActive = false;

    for (let i = 0; i < options.length; i++) {
        if (!options[i].disabled && !foundActive) {
            options[i].disabled = true;
            foundActive = true;
        } else if (foundActive && options[i].disabled) {
            options[i].disabled = false;
            break;
            
        }
    }
}*/


const { processState } = require('../serialport');
const { printBarcode } = require('../print/printer');
const { CONFIG_DATA } = require('../lib/excelReader');
const { resetProcess } = require('./reset');
const { offBins } = require('../bins');

const actualCount = document.getElementById('actualCount');
const expectedCount = document.getElementById('expectedCount');
const isPrintetEnabled = CONFIG_DATA[4].__EMPTY_9 === 'ENABLE';

async function endProcess() {
    isPrintetEnabled && printBarcode(processState.excel.filename, null);
    ++actualCount.value;
    await offBins();
    const targetAchieved = actualCount.value === expectedCount.value;
    if (targetAchieved) {
        alert('Target achieved!');
        actualCount.value = '0';
        highlightNextRow();
        enableNextSequence();
    }
    resetProcess(false, targetAchieved);
}

function highlightNextRow() {
  const rows = document.querySelectorAll('.sequence-row');
  let nextRow = null;
  
  rows.forEach(row => {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
      row.classList.add('completed');
    } else if (!row.classList.contains('completed') && !nextRow) {
      nextRow = row;
    }
  });

  if (nextRow) {
    nextRow.classList.add('active');
  }
}

function enableNextSequence() {
    const selectDeskManual = document.getElementById('selectDeskManual');
    const options = selectDeskManual.options;
    let foundActive = false;

    for (let i = 0; i < options.length; i++) {
        if (!options[i].disabled && !foundActive) {
            // Disable the current active option
            options[i].disabled = true;
            foundActive = true;
        } else if (foundActive && options[i].disabled) {
            // Enable the next sequence
            options[i].disabled = false;
            // Update expected count for the next sequence
            const nextSeqIndex = Array.from(options).findIndex(option => option.value === options[i].value);
            const nextSeqRow = document.querySelectorAll('.sequence-row')[nextSeqIndex];
            if (nextSeqRow) {
                const targetValue = parseInt(nextSeqRow.dataset.target, 10);
                document.getElementById('expectedCount').value = isNaN(targetValue) ? '-' : targetValue;
            }
            break;
        }
        }
    }

module.exports = {
    endProcess,
};


/* const { processState } = require('../serialport');
const { printBarcode } = require('../print/printer');
const { CONFIG_DATA } = require('../lib/excelReader');
const { resetProcess } = require('./reset');
const { offBins } = require('../bins');

const actualCount = document.getElementById('actualCount');
const expectedCount = document.getElementById('expectedCount');
const isPrintetEnabled = CONFIG_DATA[4].__EMPTY_9 === 'ENABLE';

async function endProcess() {
    isPrintetEnabled && printBarcode(processState.excel.filename, null);
    ++actualCount.value;
    await offBins();
    const targetAchieved = actualCount.value === expectedCount.value;
    if (targetAchieved) {
        alert('Target achieved!');
        const activeRow = document.querySelector('.sequence-row.active');
        if (activeRow) {
            const rowID = activeRow.dataset.id; // Get the row ID
            const actualValue = parseInt(actualCount.value);

            // Update the Actual field in the table
            updateActualFieldInTable(rowID, actualValue);

            // Also update the database
            fetch('http://localhost:8000/Planning/updateActualField', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ID: rowID.replace('row-', ''), Actual: actualValue }) // Removing 'row-' prefix
            })
            .then(response => response.text())
            .then(data => console.log('Actual field updated in database:', data))
            .catch(error => console.error('Error updating actual field in database:', error));
        }

        // updateActualField(rowID, actualValue); // Update the actual field
        actualCount.value = '0';
        highlightNextRow();
        enableNextSequence();
    }
    resetProcess(false, targetAchieved);
}

function updateActualFieldInTable(rowID, actualValue) {
    // Find the row with the specified ID
    const row = document.querySelector(`#${rowID}`);
    
    if (row) {
        // Find the cell that contains the Actual value (assuming it's the 5th cell)
        const actualCell = row.cells[4]; // Assuming 5th cell for 'Actual'
        
        if (actualCell) {
            // Update the Actual value
            actualCell.textContent = actualValue;

            // Optionally update the Difference cell if needed
            const targetCell = row.cells[3]; // Assuming 4th cell for 'Target'
            const differenceCell = row.cells[5]; // Assuming 6th cell for 'Difference'
            const targetValue = parseInt(targetCell.textContent, 10);
            const differenceValue = targetValue - actualValue;
            differenceCell.textContent = differenceValue;
        } else {
            console.error('Actual cell not found in row:', rowID);
        }
    } else {
        console.error('Row not found:', rowID);
    }
}



function highlightNextRow() {
  const rows = document.querySelectorAll('.sequence-row');
  let nextRow = null;
  
  rows.forEach(row => {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
      row.classList.add('completed');
    } else if (!row.classList.contains('completed') && !nextRow) {
      nextRow = row;
    }
  });

  if (nextRow) {
    nextRow.classList.add('active');
  }
}

function enableNextSequence() {
    const selectDeskManual = document.getElementById('selectDeskManual');
    const options = selectDeskManual.options;
    let foundActive = false;

    for (let i = 0; i < options.length; i++) {
        if (!options[i].disabled && !foundActive) {
            // Disable the current active option
            options[i].disabled = true;
            foundActive = true;
        } else if (foundActive && options[i].disabled) {
            // Enable the next sequence
            options[i].disabled = false;

            // Update expected count for the next sequence
            const nextSeqIndex = Array.from(options).findIndex(option => option.value === options[i].value);
            const nextSeqRow = document.querySelectorAll('.sequence-row')[nextSeqIndex];
            if (nextSeqRow) {
                const targetValue = parseInt(nextSeqRow.dataset.target, 10);
                document.getElementById('expectedCount').value = isNaN(targetValue) ? '-' : targetValue;
            }
            break;
        }
    }
}

module.exports = {
    endProcess,
};
 */