const db = require('./helpers/levelConnection');

function getChain(req, res) {
    /**
     * Method for outputting the whole chain correctly sorted.
     * @param req {object}
     * @param res {object}
     * */

    // Get chain from DB.
    db.getChain()
        .then(chain => {
            res.json(chain)
        })
        .catch(err => res.send(err));
}

module.exports = getChain;