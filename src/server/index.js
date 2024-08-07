const app = require('express')();
const port = 4000;
const db = require('./database');

app.get('/api/users/:username', (req, res) => {
    const sql = `SELECT password FROM users WHERE username = ?`;
    const { username } = req.params;
    db.get(sql, username, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else if (row) {
            return res.json({ password: row.password });
        }
        return res.status(404).json({ error: 'User not found' });
    });
});

app.listen(port, () => console.log(`GTI app listening on port ${port}!`));