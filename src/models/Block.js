/**
 * Model to block to be added to the chain.
 * */

class Block {
    constructor(address, star) {
        /**
         * @param {string}   address    The data to insert in block body.
         * */
        this.hash = "";
        this.height = 0;
        this.body = {
            address: address,
            star: star
        };
        this.time = 0;
        this.previousBlockHash = "";
    }
}

module.exports = Block;