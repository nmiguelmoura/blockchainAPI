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

        if (height === 0) {
            //Run if there are no blocks in the chain

            //Wait for the creation of Genesis block.
            await _saveBlock(0, "Genesis block - first block in the chain")
                .catch(error => {
                    res.send(error);
                });

            // Set height to 1 after Genesis Block created.
            height = 1;
        }

        // Save the new block in LevelDB
        _saveBlock(height, body)
            .then(block => {
                res.json(JSON.parse(block));
            })
            .catch(error => {
                res.send(error);
            });

    } else {
        // If no body content has been passed, output a warning.
        res.send("Error: a body must be included in the block.")
    }
}

async function _saveBlock(height, body) {
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
    return db.saveBlock(height, JSON.stringify(block));
}

module.exports = saveBlock;