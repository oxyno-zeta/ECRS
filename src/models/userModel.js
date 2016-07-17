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
const roles = ['admin', 'normal'];
const rolesObj = {
	admin: 'admin',
	normal: 'normal'
};
const UserSchema = new Schema({
	username: String,
	email: String,
	photo: String,
	role: {
		type: String,
		enum: roles
	},
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
	rolesObj: rolesObj,
	User: User
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */


