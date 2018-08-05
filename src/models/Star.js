/**
 * Model to star info to be added to a block.
 * */

class Star {
    constructor(dec, ra, story, mag, constel) {
        /**
         * @param dec       {string}    Declination of star.
         * @param ra        {string}    Right ascencion.
         * @param story     {string}    Story sent by the user.
         * @param mag       {string}    Magnitude of the star.
         * @param constel   {string}    Constellation.
         * */
        this.dec = dec;
        this.ra = ra;

        // Convert story value to hexadecimal.
        this.story = Star.convertToHex(story);

        if(mag) {
            this.mag = mag;
        }

        if(constel) {
            this.constel = constel;
        }
    }

    static convertToHex(story) {
        /**
         * Method to convert a string to hexadecimal.
         * @param story {string}    The text to be converted to hexadecimal.
         * */

        if(story) {
            // Run only if story param has been passed.

            // Return  story param in hexadecimal.
            return new Buffer(story).toString('hex');
        }
    }
}

module.exports = Star;