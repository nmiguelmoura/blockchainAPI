/**
 * This module is the entry point for the API
 * */

const express = require('express');
const bodyParser = require('body-parser');

// Start express.
const app = express();

const getChain = require('./src/getChain');
const getBlock = require('./src/getBlock');
const saveBlock = require('./src/saveBlock');
const requestValidation = require('./src/requestValidation');
const signatureValidation = require('./src/signatureValidation');

// Configure body-parser to allow access to posted data.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Allow CORS.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Route for '/'
app.get('/', (req, res) => {
    res.redirect('/chain');
});

// Route for '/chain'
app.get('/chain', (req, res) => {
    getChain(req, res);
});

// Route for '/block/:height', being height the key used to query DB
app.get('/block/:info', (req, res) => {
    getBlock(req, res);
});

// Route for '/block'. This is a post only route.
app.post('/block', (req, res) => {
    saveBlock(req, res);
});

// Route for '/requestValidation'. This is a post only route.
app.post('/requestValidation', (req, res) => {
    requestValidation(req, res);
});

app.post('/message-signature/validate', (req, res) => {
    signatureValidation(req, res);
});

// Start listening to port;
app.listen(8000, () => console.log("Blockchain API listening on port 8000..."));