const db = require('./helpers/levelConnection');
const Block = require('./models/Block');
const Star = require('./models/Star');
const SHA256 = require('crypto-js/sha256');
const mem = require('./helpers/memConnection');
const isInSchedule = require('./helpers/utils').isInSchedule;
const STORY_MAX_LENGTH =require('./helpers/constants').STORY_MAX_LENGTH;

async function saveBlock(req, res) {
    /**
     * Method for saving block, given its body content.
     * @param req {object}
     * @param res {object}
     * */

        // Get the height of the new block, by determining the length of the chain.
    let height = await db.getChainLength();

    if (height === 0) {
        //Run if there are no blocks in the chain

        //Wait for the creation of Genesis block.
        await _saveBlock(0, "0", {dec: "Genesis Block", ra: "Genesis Block", story: "Genesis Block"})
            .catch(error => {
                res.send(error);
                return;
            });

        // Set height to 1 after Genesis Block created.
        height = 1;
    }

    // Get address from post parameters.
    let address = req.body.address,
        // Get star info from post parameters.
        star = req.body.star;

    if (address && star) {
        // Run if address and star exists.

        try {
            // Try to parse star data if not already an object.
            if (typeof star !== "object") {
                star = JSON.parse(star);
            }

        } catch (e) {
            // If not possible to parse, respond with error message.
            res.send('Error: Star info format is incorrect. Should provide a JSON.');
            return;
        }

        let regRequest;
        try {
            // Try to get request validation data from memory.
            regRequest = await mem.get(address);
        } catch (e) {
            // If no info about the request exists in memory, respond with error message.
            res.send('Error: Address not found.')
        }

        if (regRequest) {
            // Run if a request for validation exist in memory.

            if (regRequest.validated) {
                // Run if the request for validation has been validated.

                if (isInSchedule(regRequest.timestamp).inSchedule) {
                    // Run if the request for validation is still in validation time window.

                    // Check if star data is valid.
                    const starValidation = isStarInfoValid(star);

                    if (starValidation.valid) {
                        // Run if star data is valid.

                        // Save the new block in LevelDB
                        _saveBlock(height, address, star)
                            .then(block => {
                                // If save was successful, delete the request from memory.
                                // That way, its only allowed one post per request
                                mem.del(address);

                                // If save was successful, respond with newly created block.
                                res.json(JSON.parse(block));
                            })
                            .catch(error => {
                                // Respond with an error message if save went wrong.
                                res.send(error);
                            });
                    } else {
                        // Run if star data is invalid.

                        // Respond with error message.
                        res.send(starValidation.message);
                    }
                } else {
                    // Run if validation time window has expired.
                    res.send('Error: The validation window has expired. Please submit a new request validation.');
                }
            } else {
                // Run if request for validation hasn't been validated yet.
                res.send('Error: you must validate your address before submitting a star.')
            }
        }
    } else {
        // If no address and star info has been passed, send error message.
        res.send("Error: an address and star info must be included in the block.")
    }
}

async function _saveBlock(height, address, star) {
    /**
     * Method to persist data to LevelDB.
     * @param height    {string}    The height of the block.
     * @param address   {string}    The wallet address.
     * @param star      {object}    Object with star info provided by the user.
     * */

    // Create a new star object with star info provided by the user.
    star = new Star(star.dec, star.ra, star.story, star.mag, star.constel);

    // Instantiate a new Block.
    let block = new Block(address, star);

    // Store the height of the block.
    block.height = height;

    // Store the timestamp.
    block.time = +new Date();

    if (height > 0) {
        // If the block is not the Genesis block, get the previous block;
        let previousBlock = await db.getBlock(height - 1);

        // Set the previousBlockHash to match the hash from the previous block.
        block.previousBlockHash = previousBlock.hash;
    }

    // Get the block hash.
    block.hash = SHA256(JSON.stringify(block)).toString();

    // Save the block in levelDB.
    return db.saveBlock(height, JSON.stringify(block));
}

function isStarInfoValid(star) {
    /**
     * Method that validates the star info data sent by the user.
     * @param star      {object}    Object with star info provided by the user.
     * */

        // Variable to store error message.
    let message = "";

    if (typeof star === "object") {
        // Run if star is an object.

        if (star.dec && star.ra && star.story) {
            // Run if required data is present.

            if(star.story.length < STORY_MAX_LENGTH) {
                // Run if story text is beyond max character number.
                return {
                    valid: true
                };
            }

            // If story text is above max character number, store a message to be returned to the user.
            message = `Error: Story is limited to ${STORY_MAX_LENGTH} characters.`
        }
        else {
            // Run if required data is missing.
            message = "Error: Star info must be complete. Required parameters: dec, ra, story. " +
                "Optional parameters: mag, constel."
        }
    } else {
        // Run if star is not an object.
        message = "Error: Invalid data format for object star."
    }

    // Return when validation is false, with corresponding error message.
    return {
        valid: false,
        message
    };
}

module.exports = saveBlock;