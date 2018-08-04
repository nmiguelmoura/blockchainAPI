const mem = require('level-mem');
const db = mem();

// Add data to levelDB with key/value pair.
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

// Get data from levelDB with key.
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

module.exports = {
    save,
    get
};