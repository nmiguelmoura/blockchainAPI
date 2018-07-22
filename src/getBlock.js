const db = require('./helpers/levelConnection');

function getBlock(req, res) {
    /**
     * Method for outputting a block, given its height in the chain.
     * @param req {object}
     * @param res {object}
     * */

    // Get the requested block height.
    let height = req.params.height;

    if (height === undefined) {
        // If no height has been passed, return warning.
        res.send("Error: Please specify the block height!");
    }

    // Get block from DB.
    db.getBlock(height)
        .then(b => res.json(b))
        .catch(err => res.send(err));
}

module.exports = getBlock;