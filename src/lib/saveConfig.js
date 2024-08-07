const { writeFile } = require('node:fs');
const { processState } = require('../serialport');

function saveConfig() {
    const deskSelection = processState.buttonsState.selectedDesk;
    let xlFile = '';
    if (deskSelection === 'manual') {
        xlFile = document.getElementById('selectDeskManual').value;
    }

    const config = {
        deskSelection,
        warningAlarm: processState.buttonsState.warningAlarm,
        cyjMovement: processState.buttonsState.cyjMovement,
        timeElapsed: processState.buttonsState.timeElapsed,
        xlFile,
    };

    writeFile('./local-config.json', JSON.stringify(config), (e) => {
        e && console.error(e);
    });
}

module.exports = {
    saveConfig,
};
