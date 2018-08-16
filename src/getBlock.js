const db = require('./helpers/levelConnection');
const ADDRESS = "address";
const HASH = "hash";


function getBlock(req, res, type) {
    /**
     * Method for outputting a block from the chain.
     * @param req {object}
     * @param res {object}
     * @param type {string} The type of search to perform.
     * */

    // Get the requested block info.
    let info = req.params.info;

    if (info === undefined) {
        // If no info has been passed, return warning.
        res.send("Error: Please specify the block info (height, hash or address)!");
        return;
    }

    switch(type) {
        case "address":
            db.getBlocksByAddress(info)
                .then(b => {
                    b.map(item => {
                        // Decode story
                        item.body.star.storyDecoded = decodeStory(item.body.star.story);
                        return item;
                    });
                    res.json(b)
                })
                .catch(e => res.send(e));
            break;

        case "hash":
            db.getBlockByHash(info)
                .then(b => {
                    // Decode story
                    b.body.star.storyDecoded = decodeStory(b.body.star.story);
                    res.json(b)
                })
                .catch(err => res.send(err));
            break;

        case "height":
        default:
            // Get block from DB.
            db.getBlock(info)
                .then(b => {
                    // Decode story
                    b.body.star.storyDecoded = decodeStory(b.body.star.story);
                    res.json(b)
                })
                .catch(err => res.send(err));
            break;
    }
}

function decodeStory(story) {
    return new Buffer(story, "hex").toString();
}

module.exports = getBlock;