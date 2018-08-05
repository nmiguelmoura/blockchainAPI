const db = require('./helpers/levelConnection');
const BLOCK_ADDRESS = 0;
const BLOCK_HASH = 1;
const BLOCK_NUMBER = 2;
const ADDRESS = "address";
const HASH = "hash";


function getBlock(req, res) {
    /**
     * Method for outputting a block from the chain.
     * @param req {object}
     * @param res {object}
     * */

    // Get the requested block info.
    let info = req.params.info;

    if (info === undefined) {
        // If no height has been passed, return warning.
        res.send("Error: Please specify the block height!");
        return;
    }

    info = getUsableInfo(info);
    switch(info.type) {
        case BLOCK_ADDRESS:
            db.getBlocksByAddress(info.value)
                .then(b => res.json(b))
                .catch(e => res.send(e));
            break;

        case BLOCK_HASH:
            db.getBlockByHash(info.value)
                .then(b => res.json(b))
                .catch(e => res.send(err));
            break;

        case BLOCK_NUMBER:
        default:
            // Get block from DB.
            db.getBlock(info.value)
                .then(b => res.json(b))
                .catch(err => res.send(err));
            break;
    }
}

function getUsableInfo(info) {
    let type,
        value;

    if(info.indexOf(ADDRESS) !== -1) {
        type = BLOCK_ADDRESS;
        value = info.split(`${ADDRESS}:`)[1]
    } else if(info.indexOf(HASH) !== -1) {
        type = BLOCK_HASH;
        value = info.split(`${HASH}:`)[1]
    } else {
        type = BLOCK_NUMBER;
        value = info;
    }

    return {
        type,
        value
    }
}

module.exports = getBlock;