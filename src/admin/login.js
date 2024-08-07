const { sleep } = require('../lib/utils');

const { CONFIG_DATA } = require('../lib/excelReader');

const usernameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');
const invalidUsernameElement = document.getElementById('invalidUsername');
const invalidPasswordElement = document.getElementById('invalidPassword');

async function onSubmit() {
    const { value: username } = usernameElement;
    const { value: password } = passwordElement;

    const response = await fetch('http://localhost:4000/api/users/' + username);
    if (response.status !== 200) {
        invalidUsernameElement.style.display = 'inline-block';
        usernameElement.value = '';
        return;
    }
    const user = await response.json();
    if (user.password === password) {
        localStorage.setItem('userName', username);
        window.location.href = '../index.html';
        return;
    }
    invalidPasswordElement.style.display = 'inline-block';
    passwordElement.value = '';
}

document.getElementById('submit').onclick = onSubmit;

usernameElement.onfocus = () => {
    invalidUsernameElement.style.display = 'none';
    invalidPasswordElement.style.display = 'none';
};
passwordElement.onfocus = () => {
    invalidUsernameElement.style.display = 'none';
    invalidPasswordElement.style.display = 'none';
};

async function setPasswordFocus() {
    usernameElement.oninput = null;
    await sleep(3000);
    passwordElement.focus();
    usernameElement.oninput = setPasswordFocus;
}

async function applyPassword() {
    passwordElement.oninput = null;
    await sleep(3000);
    onSubmit();
    passwordElement.oninput = applyPassword;
}

usernameElement.oninput = setPasswordFocus;
passwordElement.oninput = applyPassword;

document.body.style.backgroundImage = `url('../../../../images/${CONFIG_DATA[18].__EMPTY_9}')`;
