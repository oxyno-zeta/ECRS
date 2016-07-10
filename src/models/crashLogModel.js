/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 08/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crashLogSchema = new Schema({
	ver: String,
	platform: String,
	process_type: String,
	guid: String,
	_version: String,
	_productName: String,
	prod: String,
	_companyName: String,
	upload_file_minidump: String,
	extra: {},
	project: Schema.Types.ObjectId,
	date: { type: Date, default: Date.now }
});
const CrashLog = mongoose.model('CrashLog', crashLogSchema);

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	CrashLog: CrashLog
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */
