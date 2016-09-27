/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 25/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */

const apiSecurity = {
    middleware: {
        securityToken,
    },
};

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    logger,
    apiSecurity,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

function securityToken() {
    return (req, res, next) => next();
}

function logger() {
    return {
        middleware: {
            connectLogger: () => ((req, res, next) => next()),
        },
        debug: () => {
        },
        info: () => {
        },
        error: () => {
        },
        warn: () => {
        },
    };
}
