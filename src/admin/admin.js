const isAdmin = localStorage.getItem('userName') === 'admin' || localStorage.getItem('userName') === 'admin1';

document.getElementById('close').style.display = isAdmin ? 'block' : 'none';
document.getElementById('settingsButton').style.display = isAdmin ? 'block' : 'none';


const setTogglesIfAdmin = () => {
    const ids = [
        'selectDeskScannerButton',
        'selectDeskManualButton',
        'cyjMovementEnableButton',
        'cyjMovementDisableButton',
        'timeElapsedEnableButton',
        'timeElapsedDisableButton',
        'saveButton',
       
    ];
    ids.forEach((id) => {
        const b = document.getElementById(id);
        if (b) {
            b.disabled = !isAdmin;
        }
    });
};

module.exports = {
    setTogglesIfAdmin,
    isAdmin,
};
