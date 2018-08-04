const db = require('./helpers/levelConnection');
const mem = require('./helpers/memConnection');
const RegRequest = require('./models/RegRequest');
const VALIDATION_WINDOW = require('./helpers/constants').VALIDATION_WINDOW;

function requestValidation(req, res) {
    /**
     * Method to request access to validate star. If an address is submitted on payload, it generates a
     * message to send to the user to be signed.
     * @param req {object}
     * @param res {object}
     * */

        // Users wallet address.
    let address = req.body.address;

    if(address) {
        // Run if address has been provided.

        // Get data to temporarily store and send to the user.
        const regRequest = new RegRequest(address);

        mem.save(address, JSON.stringify(regRequest))
            .then(() => {
                // Issue response to the user.
                regRequest.validationWindow = VALIDATION_WINDOW;
                res.json(regRequest);
            })
            .catch(e => {
                res.send('Error: an error occurred while processing your address. Please try again.')
            });


    } else {
        // If no body content has been passed, output a warning.
        res.send("Error: an address is needed in order to proceed.");
    }
}

module.exports = requestValidation;