/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */

const winston = require('winston');
const _ = require('lodash');
const moment = require('moment');
const configurationService = require('../services/core/configurationService');

// Configuration
const configBase = {
    file: {
        filename: 'server.log',
        json: false,
        level: configurationService.getLogLevel(),
        formatter: (options) => {
            const message = (_.keys(options.meta).length !== 5) ? options.message : options.meta.stack.join('\n');

            // Return string will be passed to logger.
            return `${moment().format('YYYY/MM/DD HH:mm:ss')} [${options.level.toUpperCase()}] ${message}`;
        },
    },
    console: {
        colorize: true,
        level: configurationService.getLogLevel(),
        formatter: (options) => {
            const message = (_.keys(options.meta).length !== 5) ? options.message : options.meta.stack.join('\n');

            // Return string will be passed to logger.
            return `${moment().format('YYYY/MM/DD HH:mm:ss')} [${options.level.toUpperCase()}] ${message}`;
        },
    },
};

// Create logger
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(_.assignIn({}, configBase.console)),
        new winston.transports.File(_.assignIn({
            name: 'logs',
        }, configBase.file)),
    ],
    exceptionHandlers: [
        new (winston.transports.Console)(_.assignIn({}, configBase.console)),
        new winston.transports.File(_.assignIn({
            name: 'exceptions',
        }, configBase.file)),
    ],
});

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */
module.exports = function loggerCreator(prefix = '') {
    return {
        middleware: {
            connectLogger,
        },
        debug: logForger(prefix, logger.debug),
        info: logForger(prefix, logger.info),
        error: logForger(prefix, logger.error),
        warn: logForger(prefix, logger.warn),
    };
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Log forger.
 * @param prefix {String} Log prefix
 * @param logFunction {Function} Log function
 * @returns {Function}
 */
function logForger(prefix, logFunction) {
    return (text) => {
        let string;
        // Check if error
        if (_.isError(text)) {
            if (text.stack) {
                string = text.stack;
            } else {
                string = text.toString();
            }
        }

        // Check if array or object
        if (!string && (_.isArray(text) || _.isObject(text))) {
            string = JSON.stringify(text);
        }

        // Other case
        if (!string) {
            string = text;
        }

        logFunction(`${prefix} ${string}`);
    };
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Connect Logger.
 * @returns {Function} Logger Middleware
 */
function connectLogger() {
    return (req, res, next) => {
        // Default values for some keys
        const defaultTokens = {};
        defaultTokens[':url'] = req.originalUrl;
        defaultTokens[':protocol'] = req.protocol;
        defaultTokens[':hostname'] = req.hostname;
        defaultTokens[':method'] = req.method;
        defaultTokens[':http-version'] = `${req.httpVersionMajor}.${req.httpVersionMinor}`;
        defaultTokens[':remote-addr'] =
            req.headers['x-forwarded-for'] ||
            req.ip ||
            req._remoteAddress ||
            (req.socket &&
                (req.socket.remoteAddress ||
                    (req.socket.socket && req.socket.socket.remoteAddress)
                )
            );
        defaultTokens[':referrer'] = req.headers.referer || req.headers.referrer || '';
        defaultTokens[':user-agent'] = req.headers['user-agent'];

        let template = `Begin request :   IP: "${defaultTokens[':remote-addr']}" "${defaultTokens[':method']} ` +
            `${defaultTokens[':url']} ${defaultTokens[':http-version']}"`;

        logger.debug(template);

        // Wait for finish to log
        res.on('finish', () => {
            // Update for latest values
            defaultTokens[':status'] = res.__statusCode || res.statusCode;
            defaultTokens[':response-time'] = res.responseTime;
            defaultTokens[':date'] = new Date().toUTCString();
            defaultTokens[':content-length'] = (res._headers && res._headers['content-length']) ||
                (res.__headers && res.__headers['Content-Length']) ||
                '-';

            let logFunction = logger.info;

            // Select log function by status code
            if (res.statusCode) {
                if (res.statusCode >= 300) logFunction = logger.warn;
                if (res.statusCode >= 400) logFunction = logger.error;
            }

            // Update Template
            template = `IP: "${defaultTokens[':remote-addr']}" "${defaultTokens[':method']} ` +
                `${defaultTokens[':url']} ${defaultTokens[':http-version']}" ${defaultTokens[':status']}` +
                `     Protocol:"${defaultTokens[':protocol']}" User-agent:"${defaultTokens[':user-agent']}"` +
                ` Host:"${defaultTokens[':hostname']}"`;

            // Log
            logFunction(template);
        });

        // Call next !
        next();
    };
}
