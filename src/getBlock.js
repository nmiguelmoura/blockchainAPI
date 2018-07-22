const db = require('./helpers/levelConnection');

function getBlock(req, res) {
    let height = req.params.height;

    if (height === undefined) {
        res.send("Error: Please specify the block height!");
    }

    db.getBlock(height)
        .then(b => res.json(b))
        .catch(err => res.send(err));
}

module.exports = getBlock;