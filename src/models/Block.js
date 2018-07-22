/**
 * Class to create a block constructor.
 * */

class Block {
    constructor(data) {
        /**
         * @param {array}   data    The data to insert in block body.
         * */
        this.hash = "";
        this.height = 0;
        this.body = data;
        this.time = 0;
        this.previousBlockHash = "";
    }
}

module.exports = Block;