const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

app.use(express.json());
app.use(cors());
app.use(express.static('viewcode.html'));
app.get('/', (req, res) => {
    res.send('Python Code Executor API');
});

// Endpoint to save code snippet
app.post('/save', (req, res) => {
    const codeSnippet = req.body.code;
    if (!codeSnippet) {
        return res.status(400).json({ message: 'No code provided' });
    }

    const id = uuidv4();
    db.run("INSERT INTO code_snippets (id, code) VALUES (?, ?)", [id, codeSnippet], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error saving code snippet' });
        }
        res.json({ id: id });
    });
});

// Endpoint to retrieve a code snippet by ID
app.get('/snippet/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT code FROM code_snippets WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving code snippet' });
        }
        if (row) {
            res.json({ code: row.code });
        } else {
            res.status(404).json({ message: 'Code snippet not found' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
