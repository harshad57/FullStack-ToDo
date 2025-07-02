const express = require('express');
const { Pool } = require('pg');
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
    origin: ['https://frontend-todo-mauve.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
}));

const db = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect().then(() => console.log('connected'));

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

        const sql = "INSERT INTO public.user (name, email, password) VALUES ($1,$2,$3)";
        db.query(sql, [name, email, hash], (err, result) => {
            if (err) return res.json({ error: "Registration failed" });
            return res.json({ Status: "OK" });
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM public.user WHERE email = $1";
    db.query(sql, [email], (err, data) => {
        if (err) return res.json({ error: "Login error" });
        if (data.rows.length === 0) return res.json({ error: "User not found" });

        bcrypt.compare(password.toString(), data.rows[0].password, (err, result) => {
            if (err || !result) {
                return res.json({ error: "incorrect" });
            }

            const token = jwt.sign({ name: data.rows[0].name }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None"
            })
            return res.json({ Status: "OK" });
        });
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('token',{
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/"
    });
    return res.json({ Status: "OK" });
});

app.get('/notes', verifyUser, (req, res) => {
    const sql = `
        SELECT n.id,n.note FROM public.notes n
        JOIN public.user u ON n.user_id = u.id
        WHERE u.name = $1
    `;
    db.query(sql, [req.name], (err, data) => {
        if (err) return res.json({ error: "Failed to fetch notes" });
        return res.json({ notes: data.rows});
    });
});

app.post('/notes', verifyUser, (req, res) => {
    const note = req.body.notes;
    if (!note || !note.trim()) {
        return res.json({ error: "Note cannot be empty" });
    }

    const getUserSql = "SELECT id FROM public.user WHERE name = $1";
    db.query(getUserSql, [req.name], (err, data) => {
        if (err || data.rows.length === 0) {
            return res.json({ error: "User not found" });
        }

        const name = req.name;
        const userId = data.rows[0].id;
        const insertSql = "INSERT INTO public.notes (note, user_id, name) VALUES ($1,$2,$3) RETURNING id";
        db.query(insertSql, [note, userId, name], (err, result) => {
            if (err) return res.json({ error: "Failed to add note" });
            return res.json({ Status: "OK", noteId: result.rows[0].id });
        });
    });
});

app.delete('/notes/:id', verifyUser, (req, res) => {
    const noteId = req.params.id;
    const sql = "DELETE FROM public.notes WHERE id = $1 RETURNING id";
    db.query(sql, [noteId], (err, result) => {
        if (err) return res.json({ error: "Failed to delete note" });
        return res.json({ Status: "OK", noteId: result.rows[0].id });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('server running');
});