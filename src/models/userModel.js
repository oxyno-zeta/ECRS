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
const validation = {
	username: {
		minLength: 5
	},
	localPassword: {
		minLength: 5
	}
};
const UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: true
	},
	email: {
		type: String,
		lowercase: true,
		trim: true
	},
	photo: String,
	role: {
		type: String,
		enum: roles,
		required: true
	},
	projects: [Schema.Types.ObjectId], // Project ids
	local: {
		hash: {
			type: String,
			unique: true
		},
		salt: {
			type: String,
			unique: true
		}
	},
	github: {
		accessToken: String,
		id: {
			type: String,
			unique: true
		},
		profileUrl: String
	}
});
const User = mongoose.model('User', UserSchema);


/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	rolesObj: rolesObj,
	roles: roles,
	User: User,
	validation: validation
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */


