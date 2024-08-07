(() => {
    require('./lib/dateTime.js');
    const binsTable = document.getElementById('binsTable');
    const connnectorsTable = document.getElementById('connectorsTable');

    const { CONFIG_DATA } = require('./lib/excelReader.js');

    CONFIG_DATA.forEach((d, i) => {
        if (i < 2) return;

        if (d['SYSTEM SETTINGS']) {
            const row = document.createElement('tr');

            const si = document.createElement('td');
            si.textContent = d['SYSTEM SETTINGS'];
            row.appendChild(si);

            const name = document.createElement('td');
            name.textContent = d['__EMPTY'];
            row.appendChild(name);

            const id = document.createElement('td');
            id.textContent = d['__EMPTY_1'];
            row.appendChild(id);

            const noOfPins = document.createElement('td');
            noOfPins.textContent = d['__EMPTY_2'];
            row.appendChild(noOfPins);

            const navigation = document.createElement('td');
            navigation.textContent = d['__EMPTY_3'];
            row.appendChild(navigation);

            connnectorsTable.appendChild(row);
        }

        if (d['__EMPTY_5']) {
            const row = document.createElement('tr');

            const name = document.createElement('td');
            name.textContent = d['__EMPTY_5'];
            row.appendChild(name);

            const count = document.createElement('td');
            count.textContent = d['__EMPTY_6'];
            row.appendChild(count);

            binsTable.appendChild(row);
        }
    });
})();
