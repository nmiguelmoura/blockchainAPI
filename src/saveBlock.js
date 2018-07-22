const db = require('./helpers/levelConnection');
const Block = require('./models/Block');
const SHA256 = require('crypto-js/sha256');

async function saveBlock (req, res) {
    /**
     * Method for saving block, given its body content.
     * @param req {object}
     * @param res {object}
     * */

        // Get body content from post parameters.
    let body = req.body.body;

    if(body) {
        // Run if body exists.

        // Get the height of the new block, by determining the length of the chain.
        let height = await db.getChainLength();

        // Instantiate a new Block.
        let block = new Block(body);

        // Store the height of the block.
        block.height = height;

        // Store the timestamp.
        block.time = +new Date();

        if(height > 0) {
            // If the block is not the Genesis block, get the previous block;
            let previousBlock = await db.getBlock(height - 1);

            // Set the previousBlockHash to match the hash from the previous block.
            block.previousBlockHash = previousBlock.hash;
        }

        // Get the block hash.
        block.hash = SHA256(JSON.stringify(block)).toString();

        // Save the block in levelDB.
        db.saveBlock(height, JSON.stringify(block))
            .then(r => {
                res.json(block);
            })
            .catch(err => {res.send("Error: an unexpected error occurred.")});
    } else {
        // If no body content has been passed, output a warning.
        res.send("Error: a body must be included in the block.")
    }
}

module.exports = saveBlock;