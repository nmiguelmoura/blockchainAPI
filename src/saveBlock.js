const db = require('./helpers/levelConnection');
const Block = require('./models/Block');
const SHA256 = require('crypto-js/sha256');

async function saveBlock (req, res) {
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
}

module.exports = saveBlock;