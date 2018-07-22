const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./levelSandbox');
const axios = require('axios');
const Block = require('./Block');
const SHA256 = require('crypto-js/sha256');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.redirect('/chain');
});

app.get('/chain', (req, res) => {
    db.getChain()
        .then(chain => {
            res.charset = "utf-8";
            res.json(chain)
        })
        .catch(err => res.send(err));
});

app.get('/block/:height', (req, res) => {
    let height = req.params.height;

    if (height === undefined) {
        res.send("Error: Please specify the block height!");
    }

    db.getBlock(height)
        .then(b => res.json(b))
        .catch(err => res.send(err));
});

app.post('/block', async (req, res) => {
    let body = req.body.body;
    if(body) {
        let height = await db.getChainLength();
        let block = new Block();
        block.height = height;
        block.body = body;
        block.time = +new Date();

        if(height > 0) {
            let previousBlock = await db.getBlock(height - 1);
            block.previousBlockHash = previousBlock.hash;
        }

        block.hash = SHA256(JSON.stringify(block)).toString();

        db.saveBlock(height, JSON.stringify(block))
            .then(r => {
                res.json(block);
            })
            .catch(err => {res.send("Error: an unexpected error occurred.")});
    } else {
        res.send("Error: a body must be included in the block.")
    }
});

app.listen(8000, () => console.log("Blockchain API listening on port 8000..."));