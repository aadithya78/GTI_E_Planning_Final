const { runTests, runScannerTest } = require('../renderConImage');

const selectDeskManual = document.getElementById('selectDeskManual'),
    selectDeskScanner = document.getElementById('selectDeskScanner'),
    selectDeskScannerButton = document.getElementById('selectDeskScannerButton'),
    selectDeskManualButton = document.getElementById('selectDeskManualButton');

selectDeskManualButton.onclick = () => {
    selectDeskScanner.style.display = 'none';
    selectDeskManual.style.display = 'block';
    selectDeskScannerButton.classList.remove('add-border');
    selectDeskManualButton.classList.add('add-border');
};

selectDeskScannerButton.onclick = () => {
    selectDeskManual.style.display = 'none';
    selectDeskScanner.style.display = 'block';
    selectDeskScanner.focus();
    selectDeskScannerButton.classList.add('add-border');
    selectDeskManualButton.classList.remove('add-border');
};

selectDeskManual.onchange = ({ target }) => runTests(target);
selectDeskScanner.oninput = runScannerTest;
