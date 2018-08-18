const mem = require('level-mem');
const db = mem();

/**
 * Module to communicate with mem to store in memory data.
 * */

// Add data to mem with key/value pair.
function save(key, value) {
    return new Promise(function (resolve, reject) {
        db.put(key, value, function (err) {
            if (err) {
                reject(`Error: block #${key} submission failed`);
            }

            resolve(JSON.parse(value));
        })
    })
}

// Get data from mem with key.
function get(key) {
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

// Delete data from mem with key.
function del(key) {
    return new Promise(function (resolve, reject) {
        db.del(key, function (err, value) {
            if (err) {
                reject('Error: Block not found!', err);
            } else {
                resolve(`Block with key ${key} deleted!`);
            }
        });
    });
}

module.exports = {
    save,
    get,
    del
};