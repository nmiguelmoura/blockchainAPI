const db = require('./helpers/levelConnection');

function getChain(req, res) {
    db.getChain()
        .then(chain => {
            res.json(chain)
        })
        .catch(err => res.send(err));
}

module.exports = getChain;