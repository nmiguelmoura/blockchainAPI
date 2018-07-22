const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const getChain = require('./src/getChain');
const getBlock = require('./src/getBlock');
const saveBlock = require('./src/saveBlock');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.redirect('/chain');
});

app.get('/chain', (req, res) => {
    getChain(req, res);
});

app.get('/block/:height', (req, res) => {
    getBlock(req, res);
});

app.post('/block', (req, res) => {
    saveBlock(req, res);
});

app.listen(8000, () => console.log("Blockchain API listening on port 8000..."));