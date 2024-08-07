(async () => {
    const { readdir } = require('node:fs');
    const path = require('node:path');
    const { CONFIG_DATA } = require('./lib/excelReader');
    const { processState, closePort } = require('./serialport');
    require('./lib/dateTime');

    const config = require('../local-config.json');
    const { checkPort } = require('./actions/verify');
    const { setTogglesIfAdmin } = require('./admin/admin');
    const { saveConfig } = require('./lib/saveConfig');
    processState.appType = CONFIG_DATA[14].__EMPTY_9.toUpperCase();
    document.getElementById('pageTitle').textContent = CONFIG_DATA[15].__EMPTY_9;

    if (processState.appType !== 'BONDER') {
        [...document.getElementsByClassName('spl-hidden')].forEach((e) => {
            e.style.display = 'block';
        });
    }

    const selectDeskManual = document.getElementById('selectDeskManual');
    if (config.deskSelection === 'manual') {
        document.getElementById('selectDeskManualButton').classList.add('add-border');
        selectDeskManual.style.display = 'block';
        selectDeskManual.value = config.xlFile;
        document.getElementById('selectDeskScanner').style.display = 'none';
        document.getElementById('selectDeskScannerButton').classList.remove('add-border');
        processState.buttonsState.selectedDesk = 'manual';
    }

    if (config.cyjMovement) {
        document.getElementById('cyjMovementEnableButton').classList.add('add-border');
        document.getElementById('cyjMovementDisableButton').classList.remove('add-border');
        processState.buttonsState.cyjMovement = true;
    } else {
        document.getElementById('cyjMovementDisableButton').classList.add('add-border');
        document.getElementById('cyjMovementEnableButton').classList.remove('add-border');
    }

    if (config.timeElapsed) {
        document.getElementById('timeElapsedEnableButton').classList.add('add-border');
        document.getElementById('timeElapsedDisableButton').classList.remove('add-border');
        processState.buttonsState.timeElapsed = true;
    } else {
        document.getElementById('timeElapsedDisableButton').classList.add('add-border');
        document.getElementById('timeElapsedEnableButton').classList.remove('add-border');
    }

    if (config.warningAlarm) {
        document.getElementById('warningAlarmOnButton').classList.add('add-border');
        document.getElementById('warningAlarmOffButton').classList.remove('add-border');
        processState.buttonsState.timeElapsed = true;
    } else {
        document.getElementById('warningAlarmOffButton').classList.add('add-border');
        document.getElementById('warningAlarmOnButton').classList.remove('add-border');
    }

    document.getElementById('settingsButton').onclick = async () => {
        await closePort();
        window.location.href = './settings.html';
    };


    document.getElementById('logo').onclick = async () => {
        window.location.reload;
    };



    document.getElementById('saveButton').onclick = saveConfig;

    setTogglesIfAdmin();

  /*if (await checkPort()) {
        require('./lib/selectDesk');
        const fragment = document.createDocumentFragment();
        readdir(path.join('./process'), (err, files) => {
            if (err) throw err;
            files
                .filter((file) => file.includes('.xls'))
                .forEach((file) => {
                    const option = document.createElement('option');
                    option.innerHTML = file.split('.')[0];
                    fragment.appendChild(option);
                });
            selectDeskManual.appendChild(fragment);
            selectDeskManual.value = ' ';
        });
    }*/

       /*  if (await checkPort()) {
            require('./lib/selectDesk');
            const fragment = document.createDocumentFragment();
            fetch('http://localhost:8000/Planning/indexTable')
                .then(response => response.json())
                .then(data => {
                    data.sort((a, b) => {
                        if (a.Seq === b.Seq) {
                            return 0;
                        } else if (a.Seq < b.Seq) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });
                    data.forEach((row) => {
                        const option = document.createElement('option');
                        option.innerHTML = row.Process;
                        fragment.appendChild(option);
                    });
        
                    selectDeskManual.appendChild(fragment);
                    selectDeskManual.value = ' ';
                })
                .catch(err => console.error('Error fetching data:', err));
        }
 */

        if (await checkPort()) {
            require('./lib/selectDesk');
            const fragment = document.createDocumentFragment();
            fetch('http://localhost:8000/Planning/indexTable')
                .then(response => response.json())
                .then(data => {
                    data.sort((a, b) => a.Seq - b.Seq);
                    data.forEach((row, index) => {
                        const option = document.createElement('option');
                        option.innerHTML = row.Process;
                        //option.value = row.Seq;
                        option.disabled = index !== 0; // Disable options that are not the first sequence initially
                        fragment.appendChild(option);
                    });
                    const selectDeskManual = document.getElementById('selectDeskManual');
                    selectDeskManual.appendChild(fragment);
                    selectDeskManual.value = '';
                })
                .catch(err => console.error('Error fetching data:', err));
        }
        


})();
