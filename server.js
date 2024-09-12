// Budget API

const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const path = require('path');

app.use('/', express.static('public'));

app.get('/budget', (req, res) => {
    const filePath = path.join(__dirname, 'budget-data.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading budget data:', err);
            res.status(500).send('Server Error');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});