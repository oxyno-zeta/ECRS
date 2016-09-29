/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 25/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */


/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    logger,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

function logger() {
    return {
        middleware: {
            connectLogger: () => ((req, res, next) => next()),
        },
        debug: () => {
        },
        info: () => {
        },
        error: text => {
            if (text) {
                console.error(text);
            }
        },
        warn: () => {
        },
    };
}
