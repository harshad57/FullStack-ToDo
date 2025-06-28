const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookie = require('cookie-parser');
require('dotenv').config();

const app = express();
const salt = 10;

app.use(express.json());
app.use(cookie());
app.use(cors({
    origin: ['https://frontend-todo-mauve.vercel.app/'],
    methods: ['GET', 'POST'],
    credentials: true
}));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.json({ error: "No token found" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.json({ error: "Invalid token" });
        req.name = decoded.name;
        next();
    });
};

app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "OK", name: req.name });
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password.toString(), salt, (err, hash) => {
        if (err) return res.json({ error: "Hashing failed" });

        const sql = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [name, email, hash], (err, result) => {
            if (err) return res.json({ error: "Registration failed" });
            return res.json({ Status: "OK" });
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM user WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) return res.json({ error: "Login error" });
        if (data.length === 0) return res.json({ error: "User not found" });

        bcrypt.compare(password.toString(), data[0].password, (err, result) => {
            if (err || !result) {
                return res.json({ error: "incorrect" });
            }

            const token = jwt.sign({ name: data[0].name }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token);
            return res.json({ Status: "OK" });
        });
    });
    console.log(res)
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "OK" });
});

app.get('/notes', verifyUser, (req, res) => {
    const sql = `
        SELECT n.note FROM notes n
        JOIN user u ON n.user_id = u.id
        WHERE u.name = ?
    `;
    db.query(sql, [req.name], (err, data) => {
        if (err) return res.json({ error: "Failed to fetch notes" });
        return res.json({ notes: data.map(row => row.note) });
    });
});

app.post('/notes', verifyUser, (req, res) => {
    const note = req.body.notes;
    if (!note || !note.trim()) {
        return res.json({ error: "Note cannot be empty" });
    }

    const getUserSql = "SELECT id FROM user WHERE name = ?";
    db.query(getUserSql, [req.name], (err, data) => {
        if (err || data.length === 0) {
            return res.json({ error: "User not found" });
        }
        
        const name = req.name;
        const userId = data[0].id;
        const insertSql = "INSERT INTO notes (note, user_id, name) VALUES (?, ?, ?)";
        db.query(insertSql, [note, userId, name], (err, result) => {
            if (err) return res.json({ error: "Failed to add note" });
            return res.json({ Status: "OK", noteId: result.insertId });
        });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('server running');
<<<<<<< HEAD
});
=======
});
>>>>>>> 663864b59161b007638815eec55d50ff0fb82639
