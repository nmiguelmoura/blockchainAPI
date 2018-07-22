/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

let level = require('level');
let chainDB = './chaindata';
let db = level(chainDB);

// Add data to levelDB with key/value pair
function saveBlock(key, value) {
    return new Promise(function (resolve, reject) {
        db.put(key, value, function (err) {
            if (err) {
                reject(`Error: block #${key} submission failed`);
            }

            resolve();
        })
    })

}

// Get data from levelDB with key
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

//Get all data from DB
function getChain() {
    return new Promise(function (resolve, reject) {
        let result = [];

        db.createReadStream()
            .on('data', function (data) {
                result.push(data.value);
            })
            .on('error', function () {
                reject('Error retrieving from data from DB');
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

// Add data to levelDB with value
function addDataToLevelDB(value) {
    let i = 0;
    db.createReadStream().on('data', function (data) {
        i++;
    }).on('error', function (err) {
        return console.log('Unable to read data stream!', err)
    }).on('close', function () {
        console.log('Block #' + i);
        addLevelDBData(i, value);
    });
}

module.exports = {
    'getBlock': getBlock,
    'getChain': getChain,
    'getChainLength': getChainLength,
    'saveBlock': saveBlock
};

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

/*
(function theLoop (i) {
    setTimeout(function () {
        addDataToLevelDB('Testing data');
        if (--i) theLoop(i);
    }, 100);
})(10);
*/