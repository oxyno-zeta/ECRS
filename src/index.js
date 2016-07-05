/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var server = require('./server');

/* ************************************* */
/* ********         RUN         ******** */
/* ************************************* */

// Prepare server
server.prepare();

// Listen server
server.listen();
