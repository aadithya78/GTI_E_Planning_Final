/*const sqlite3 = require('sqlite3').verbose();

// Open the database
let db = new sqlite3.Database('db.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

// Get the form elements
const createUserWindow = document.getElementById('create-user-window');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const createUserBtn = document.getElementById('create-user');
const createUserCloseBtn = document.getElementById('create-user-close');

// Add an event listener to the create user button
createUserBtn.addEventListener('click', (e) => {
  e.preventDefault();

  // Get the username, password, and confirm password values
  const username = usernameInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Check if the passwords match
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  // Insert the data into the database
  db.run(`
    INSERT INTO users (username, password) VALUES (?, ?);
  `, username, password, (err) => {
    if (err) {
      console.error(err.message);
    } 
   
    else {
      console.log(`User created successfully!`);
      alert(`New User ${username} created `)
      // Close the create user window
      createUserWindow.style.display = 'none';
    }
  });
});

// Add an event listener to the close button
createUserCloseBtn.addEventListener('click', () => {
  createUserWindow.style.display = 'none';
});*/


const sqlite3 = require('sqlite3').verbose();

// Open the database
let db = new sqlite3.Database('db.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the users database.');
  }
});

// Get the form elements
const createUserWindow = document.getElementById('create-user-window');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const createUserBtn = document.getElementById('create-user');
const createUserCloseBtn = document.getElementById('create-user-close');


//Update password
const UpdateWindow = document.getElementById('edit-pass-window');
const UpdateUserCloseBtn = document.getElementById('edit-pass-close');
const userSelectUpdate = document.getElementById('user-select-update');
const UpdatePassBtn = document.getElementById('update-pass');

const oldPass = document.getElementById('old-pass');
const passwordInputUpdate = document.getElementById('password-update');
const confirmPasswordInputUpdate = document.getElementById('confirmPassword-update');


//Delete user
const deleteUserWindow = document.getElementById('delete-user-window');
const deleteUserCloseBtn = document.getElementById('delete-user-close');
const userSelect = document.getElementById('user-select');
const deleteUserBtn = document.getElementById('delete-user');

function resetFormFields() {
  usernameInput.value = '';
  passwordInput.value = '';
  confirmPasswordInput.value = '';

  oldPass.value = '';
  passwordInputUpdate.value= '';
  confirmPasswordInputUpdate.value = '';

}

//<------------------------------------------------------CREATE USER --------------------------------------------->
createUserBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // Get the username, password, and confirm password values
  const username = usernameInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Check if the passwords match
  if (password !== confirmPassword) {
    return;
  }
  // Insert the data into the database
  db.run(`
    INSERT INTO users (username, password) VALUES (?, ?);
  `, username, password, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("User created successfully!");
      createUserWindow.style.display = 'none';
      resetFormFields();
      populateUserSelect();
    }
  });
});
//<----------------------------------------------------------------------------------------------------------------->

//<---------------------------------------------------------DELETE USER --------------------------------------------->


// Add event listener to the delete button
deleteUserBtn.addEventListener("click", function(){
  const userIdToDelete = userSelect.value;
  // Delete the row from the database
  db.run(`DELETE FROM users WHERE id = ?`, userIdToDelete, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Row deleted successfully');
      // Close the delete user window
      populateUserSelect();
      //new
      
      
    }
  });
});

// Add event listener to the user select dropdown
userSelect.addEventListener("change", (event) => {
  userIdToDelete = event.target.value;
});

//<------------------------------------------------------------------------------------------------------------------->

//<-------------------------------------------------UPDATE PASSWORD --------------------------------------------------->
UpdatePassBtn.addEventListener("click", function(){
  const oldPassValue = oldPass.value;
  const newPassValue = passwordInputUpdate.value;
  const confirmNewPassValue = confirmPasswordInputUpdate.value;

  if (newPassValue!== confirmNewPassValue) {
    alert("New password and confirm password do not match");
    return;
  }

  // Verify the old password
  db.get(`SELECT password FROM users WHERE id =?`, userSelectUpdate.value, (err, row) => {
    if (err) {
      console.error(err);
    } else {
      const storedOldPass = row.password;
      if (oldPassValue!== storedOldPass) {
        alert("Old password is incorrect");
      } else {
        // Update the password
        db.run(`UPDATE users SET password =? WHERE id =?`, newPassValue, userSelectUpdate.value, (err) => {
          if (err) {
            console.error(err);
          } else {
            alert('Password updated successfully');
            populateUserSelect();
            resetFormFields();
            UpdateWindow.style.display = "none";
          }
        });
      }
    }
  });
});

//<-------------------------------------------------------------------------------------------------------------------->

// Populate the user select dropdown
function populateUserSelect() {
  db.all(`SELECT * FROM users`, (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      userSelect.innerHTML = ""; // Clear the select dropdown
      userSelectUpdate.inner = "";
      rows.forEach((row) => {
        const option = document.createElement("option");
        option.value = row.id;
        option.text = row.username;
       // console.log(row.username);
        userSelect.appendChild(option);
        userSelectUpdate.appendChild(option.cloneNode(true));
      });
    }
  });
}


// Populate the user select dropdown
populateUserSelect();