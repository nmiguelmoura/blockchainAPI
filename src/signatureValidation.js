const mem = require('./helpers/memConnection');
const Message = require('bitcore-message');
const isInSchedule = require('./helpers/utils').isInSchedule;
const isSignatureValid = require('./helpers/bitcoreSignatureValidation');

// const RegRequest = require('./models/RegRequest');

async function signatureValidation(req, res) {
    /**
     * Method to request access to validate star. If an address is submitted on payload, it generates a
     * message to send to the user to be signed.
     * @param req {object}
     * @param res {object}
     * */

    // await mem.save('n1ZCYg9YXtB5XCZazLxSmPDa8iwJRZHhGx', JSON.stringify(new RegRequest('n1ZCYg9YXtB5XCZazLxSmPDa8iwJRZHhGx')));

        // Users wallet address.
    let address = req.body.address,
        signature = req.body.signature;

    if(address && signature) {
        // Run if address and signature had been provided.

        // Variable to store registry validation request.
        let regRequest;

        try {
            // Try to get request validation from memory using the address as key.
            regRequest = await mem.get(address);
        } catch(e) {
            // If no key corresponding to the given address exists in memory, responds with an error.
            res.send('Error: address not found.')
        }

        if(regRequest) {
            // Run if a request for validation exists for the given address.

            // Check validation time status.
            const timeStatus = isInSchedule(regRequest.timestamp);

            if(timeStatus.inSchedule) {
                // run if request is beyond the validation time window.

                if(isSignatureValid(address, signature, regRequest.message)) {
                    // Run if signature is valid.

                    // Set request validation validated parameter to true.
                    regRequest.validated = true;

                    // Update request validation window.
                    regRequest.validationWindow = timeStatus.timeLeft;

                    // Save the validated request to memory using the address as key.
                    mem.save(address, JSON.stringify(regRequest))
                        .then(reg => {
                            // Delete validated property from reg (user doesn't need this)
                            delete reg['validated'];

                            // Issue a response
                            let result = {
                                registerStar: true,
                                status: reg
                            };
                            res.json(result);
                        })
                        .catch(e => {
                            // Run if an error happens while saving.
                            res.send('Error: An error occurred while giving access permission. Please try again.');
                        });
                } else {
                    // Run if signature is not valid.
                    res.send('Error: Signature is not valid.');
                }
            } else {
                // Run if validation window as expired.
                res.send('Error: The validation window has expired. Please submit a new request validation.');
            }
        }

    } else {
        // If no body content has been passed, output a warning.
        res.send("Error: an address and signature are needed in order to proceed.");
    }
}

module.exports = signatureValidation;