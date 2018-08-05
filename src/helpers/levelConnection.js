/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

let level = require('level');
let chainDB = './chaindata';
let db = level(chainDB);

// Add data to levelDB with key/value pair.
function saveBlock(key, value) {
    return new Promise(function (resolve, reject) {
        db.put(key, value, function (err) {
            if (err) {
                reject(`Error: block #${key} submission failed`);
            }

            resolve(value);
        })
    })
}

// Get data from levelDB with key.
function getBlock(key) {
    return new Promise(function (resolve, reject) {
        db.get(key, function (err, value) {
            if (err) {
                reject('Error: Block not found!', err);
            } else {
                resolve(JSON.parse(value));
            }
        });
    });
}

// Get the number of blocks stored in the chain.
function getChainLength() {
    return new Promise(function (resolve, reject) {
        let i = 0;

        db.createReadStream()
            .on('data', function () {
                i++;
            })
            .on('error', function () {
                reject("Could not retrieve chain length");
            })
            .on('close', function () {
                resolve(i);
            });
    })
}

//Get all data from DB.
function getChain() {
    return new Promise(function (resolve, reject) {
        let result = [];

        db.createReadStream()
            .on('data', function (data) {
                result.push(data.value);
            })
            .on('error', function () {
                reject('Error: Error retrieving from data from DB');
            })
            .on('close', function () {
                result = result
                    .map(function (r) {
                        return JSON.parse(r);
                    })
                    .sort(function (a, b) {
                        return a.height - b.height;
                    });
                resolve(result);
            });
    });
}

function getBlockByHash(hash) {
    return new Promise(function (resolve, reject) {
        let temp,
            result = null;

        db.createValueStream()
            .on('data', function (data) {
                temp = JSON.parse(data);
                if (hash === temp.hash) {
                    result = temp;
                }
            })
            .on('error', function () {
                reject('Error: Error retrieving from data from DB');
            })
            .on('close', function () {
                resolve(result);
            })

    });
}

function getBlocksByAddress(address) {
    return new Promise(function (resolve, reject) {
        let temp,
            result = [];

        db.createValueStream()
            .on('data', function(data) {
                temp = JSON.parse(data);
                if (address === temp.body.address) {
                    result.push(data);
                }
            })
            .on('error', function() {
                reject('Error: Error retrieving from data from DB');
            })
            .on('close', function() {
                result = result.map(r => {
                    return JSON.parse(r);
                });
                resolve(result);
            })
    });
}

module.exports = {
    getBlock,
    getChain,
    getChainLength,
    saveBlock,
    getBlockByHash,
    getBlocksByAddress
};