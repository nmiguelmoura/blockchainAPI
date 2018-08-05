const VALIDATION_WINDOW = require('./constants').VALIDATION_WINDOW;

function isInSchedule(storedTimestamp) {
    /**
     * Method to check if a given request is within the validation time window.
     * @param storedTimestamp {string}  The timestamp stored in the requet validation.
     * */

        // Get the time elapsed (in seconds) since request was submitted.
    const timeSpent = (+new Date() - storedTimestamp) / 1000,

        // Get the time left to reach the validation time window.
        timeLeft = VALIDATION_WINDOW - timeSpent;

    return {
        // output boolean after check if time still left.
        inSchedule: timeLeft > 0,

        // output the time left.
        timeLeft
    };
}

module.exports = {
    isInSchedule
};