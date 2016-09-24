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
const projectSchema = new Schema({
    name: String,
    projectUrl: String,
    crashLogList: [Schema.Types.ObjectId], // Crash log Model lists
});
const Project = mongoose.model('Project', projectSchema);

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    Project,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */
