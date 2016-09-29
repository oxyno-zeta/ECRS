/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const server = require('./server');

/* ************************************* */
/* ********         RUN         ******** */
/* ************************************* */

// Prepare server
server.prepare().then(() => (
    // Listen server
    server.listenSync()
)).catch(() => process.exit(1));
