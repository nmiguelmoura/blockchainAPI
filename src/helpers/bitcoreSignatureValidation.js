const Message = require('bitcore-message');

module.exports = (address, signature, message) => {
    /**
     * Method to take care of validating signatures using bitcore-message.
     * @param address   {string}    The wallet address.
     * @param signature {string     The signature from the user.
     * @param message   {string}    The message to be validated.
     * */
    let result = false;
    try {
        // Try to validate message signature.
        result = Message(message).verify(address, signature);
    } catch (e) {
        //pass
    }

    // Return result of validation.
    return result;
};