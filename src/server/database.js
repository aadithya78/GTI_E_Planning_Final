const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = 'db.sqlite';

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
    }
    logUsernames();
});

function logUsernames() {
    const sql = `SELECT username FROM users`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }

        // Log the table name
        console.log('Users:');

        // Log each username
        rows.forEach(row => {
           // console.log(row.username);
            return row.username;
        });
    });
}
 

module.exports = db;


/*
const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = 'db.sqlite';

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        // Function to log all tables and their rows
        logEntireDatabase();
    }
});

function logEntireDatabase() {
    // Step 1: Get all table names in the database
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", (err, tables) => {
        if (err) {
            console.error(err.message);
            return;
        }

        // Step 2: Query each table and log its rows
        tables.forEach(table => {
            const tableName = table.name;
            const sql = `SELECT * FROM ${tableName}`;

            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    return;
                }

                // Log the table name
                console.log(`Table: ${tableName}`);

                // Log each row in the table
                 console.log('Users:');

        // Log each username
        rows.forEach(row => {
            console.log(row.username);
                });
            });
        });
    });
}

module.exports = db;

*/
