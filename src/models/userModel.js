/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 14/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Variables
const UserSchema = new Schema({
	username: String,
	email: String,
	photo: String,
	projects: [Schema.Types.ObjectId], // Project ids
	local: {
		hash: String,
		salt: String
	},
	github: {
		accessToken: String,
		id: String,
		profileUrl: String
	}
});
const User = mongoose.model('User', UserSchema);


/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	User: User
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */


