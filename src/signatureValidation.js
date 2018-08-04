const mem = require('./helpers/memConnection');
const Message = require('bitcore-message');
const VALIDATION_WINDOW = require('./helpers/constants').VALIDATION_WINDOW;

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
        let regRequest;
        try {
            regRequest = await mem.get(address);
        } catch(e) {
            res.send('Error: address not found.')
        }

        if(regRequest) {
            const timeStatus = isInSchedule(regRequest.timestamp);
            if(timeStatus.inSchedule) {
                if(isSignatureValid(address, signature, regRequest.message)) {
                    regRequest.validated = true;
                    regRequest.validationWindow = timeStatus.timeLeft;
                    mem.save(address, JSON.stringify(regRequest))
                        .then(reg => {
                            delete reg['validated'];
                            let result = {
                                registerStar: true,
                                status: reg
                            };
                            res.json(result);
                        })
                        .catch(e => {
                            res.send('Error: An error occurred while giving access permission. Please try again.');
                        });
                } else {
                    res.send('Error: Signature is not valid.');
                }
            } else {
                res.send('Error: The validation window has expired. Please submit a new request validation.')
            }
        }

    } else {
        // If no body content has been passed, output a warning.
        res.send("Error: an address and signature are needed in order to proceed.");
    }
}

function isInSchedule(storedTimestamp) {
    const timeSpent = (+new Date() - storedTimestamp) / 1000,
        timeLeft = VALIDATION_WINDOW - timeSpent;

    return {
        inSchedule: timeLeft > 0,
        timeLeft
    };
}

function isSignatureValid(address, signature, message) {
    let result = false;
    try {
        result = Message(message).verify(address, signature);
    } catch (e) {
        //pass
    }
    return result;
}

module.exports = signatureValidation;