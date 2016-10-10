/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const path = require('path');
const {
    EmailTemplate,
    } = require('email-templates');
const mailCoreService = require('./core/mailCoreService');
const configurationService = require('./core/configurationService');

const mainTemplateDir = path.join(__dirname, 'mail-templates');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    sendRegisterEmail,
    sendNewCrashLogEmail,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Send new crash log email.
 * @param toEmail {String} To email
 * @param projectInstance {Object} Project instance
 * @returns {Promise}
 */
function sendNewCrashLogEmail(toEmail, projectInstance) {
    return new Promise((resolve, reject) => {
        // Get transporter
        const transporter = mailCoreService.getTransporter();

        // Prepare template directory
        const registerMailTemplareDirectory = path.join(mainTemplateDir, 'new-crash-log');

        // Get template sender
        const templateSender = transporter.templateSender(new EmailTemplate(registerMailTemplareDirectory), {
            from: configurationService.mail.getMailFrom(),
            subject: `New Crash Report just published for project ${projectInstance.name}`,
            attachments: [{
                filename: 'logo.png',
                path: path.join(registerMailTemplareDirectory, 'logo.png'),
                cid: 'logo',
            }],
        });

        const message = {
            to: toEmail,
        };

        // Context for the template renderer
        const context = {
            project: projectInstance,
            backendUrl: configurationService.getBackendUrl(),
        };

        // Send using template
        templateSender(message, context, (error, info) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(info);
        });
    });
}

/**
 * Send Register Email.
 * @param toEmail {String} to email
 * @returns {Promise}
 */
function sendRegisterEmail(toEmail) {
    return new Promise((resolve, reject) => {
        // Get transporter
        const transporter = mailCoreService.getTransporter();

        // Prepare template directory
        const registerMailTemplareDirectory = path.join(mainTemplateDir, 'register');

        // Get template sender
        const templateSender = transporter.templateSender(new EmailTemplate(registerMailTemplareDirectory), {
            from: configurationService.mail.getMailFrom(),
            subject: 'Thanks for Register !',
            attachments: [{
                filename: 'logo.png',
                path: path.join(registerMailTemplareDirectory, 'logo.png'),
                cid: 'logo',
            }],
        });

        const message = {
            to: toEmail,
        };

        // Context for the template renderer
        const context = {};

        // Send using template
        templateSender(message, context, (error, info) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(info);
        });
    });
}

