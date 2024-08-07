(() => {
    const { CONFIG_DATA } = require('./excelReader');

    document.getElementById('user').textContent = localStorage.getItem('userName');
    const currentDate = document.getElementById('currentDate');
    const currentTime = document.getElementById('currentTime');
    const shift = document.getElementById('shift');
    const shifts = [];

    const noOfShifts = CONFIG_DATA[9].__EMPTY_9;
    for (let i = 10; i < noOfShifts + 10; i++) {
        shifts.push([
            CONFIG_DATA[i].__EMPTY_8, // Shift Name
            CONFIG_DATA[i].__EMPTY_9, // Shift Start Time in hours
            CONFIG_DATA[i].__EMPTY_10, // Shift Start Time in minutes
        ]);
    }

    const date = new Date();
    currentDate.textContent = date.toLocaleDateString('en-in');
    currentTime.textContent = date.toLocaleTimeString('en-in');
    setInterval(() => {
        const d = new Date();
        currentTime.textContent = d.toLocaleTimeString();
        const h = d.getHours();
        const m = d.getMinutes();
        shifts.forEach((s) => {
            if (h >= s[1] && m >= s[2]) {
                shift.textContent = s[0];
                return;
            }
        });
    }, 1000);
})();
