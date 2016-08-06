/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 17/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var crypto = require('crypto');
var _ = require('lodash');
// Variables
var lengthRandomBytes = 50;
var iterations = 15000;
var keylen = 50;
var digest = 'sha512';

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */
module.exports = {
	generateSaltSync: generateSaltSync,
	generateHash: generateHash,
	compare: compare
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Random Bytes.
 * @returns {*}
 */
function randomBytes() {
	return crypto.randomBytes(lengthRandomBytes);
}

/**
 * Hash text.
 * @param text {String} Text
 * @param salt {String} Salt
 * @param iterations {Number} Number of iterations
 * @param keylen {Number} Hash Length
 * @param digest {String} Digest algorithm
 * @returns {Promise}
 */
function genHashPrivate(text, salt, iterations, keylen, digest) {
	return new Promise(function (resolve, reject) {
		crypto.pbkdf2(text, salt, iterations, keylen, digest, function (err, hash) {
			if (err) {
				reject(err);
				return;
			}

			resolve(hash);
		});
	});
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Generate Salt Sync.
 * @returns {*}
 */
function generateSaltSync() {
	return randomBytes().toString('hex');
}

/**
 * Generate Hash.
 * @param text {String} Text
 * @param salt {String} Salt
 * @returns {Promise}
 */
function generateHash(text, salt) {
	return new Promise(function (resolve, reject) {
		genHashPrivate(text, salt, iterations, keylen, digest)
			.then(result => resolve(result.toString('hex'))).catch(reject);
	})
}

/**
 * Compare Hash to hashed text with salt.
 * @param hash {String} Hash
 * @param text {String} Text
 * @param salt {String} Salt
 * @returns {Promise}
 */
function compare(text, hash, salt) {
	return new Promise(function (resolve, reject) {
		generateHash(text, salt).then(hash2 => resolve(_.isEqual(hash, hash2))).catch(reject);
	});
}

