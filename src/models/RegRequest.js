/**
 * Model to create a RegRequest.
 * */

const DEFAULT_REG_REQUEST_MESSAGE = require('./../helpers/constants').DEFAULT_REG_REQUEST_MESSAGE;

class RegRequest {
    constructor(address) {
        /**
         * @param {string}   data    The data to insert in block body.
         * */
        this.address = address;
        this.timestamp = +new Date();
        this.message = `${address}:${this.timestamp}:${DEFAULT_REG_REQUEST_MESSAGE}`;
    }
}

module.exports = RegRequest;