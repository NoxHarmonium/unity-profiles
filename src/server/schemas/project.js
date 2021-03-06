(function (require, module) {
  'use strict';

  var mongoose = require('mongoose-q')();
  var config = require('../../shared/config.js');
  var Schema = mongoose.Schema;
  var timestamps = require('mongoose-timestamp');

  var projectNameValidator = require('./validators/projectNameValidator.js');
  var sortNameValidator = require('./validators/sortNameValidator.js');
  var descriptionValidator = require('./validators/descriptionValidator.js');
  var emailValidator = require('./validators/emailValidator.js');
  var deviceCountValidator = require('./validators/deviceCountValidator.js');

  var ProjectSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: projectNameValidator
    },
    // sortingName is all uppercase for sorting purposes
    // MongoDB cant sort mixed case strings alphabetically
    // http://stackoverflow.com/questions/7644087/php-mongodb-sort-results-by-alphabetical
    sortingName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: sortNameValidator
    },
    description: {
      type: String,
      validate: descriptionValidator
    },
    admins: [{ // Referencing user email address
      type: String,
      trim: true,
      validate: emailValidator
    }],
    users: [{ // Referencing user email address
      type: String,
      trim: true,
      validate: emailValidator
    }],
    deviceCount: { // Not user editable. Updated when devices connect/disconnect
      type: Number,
      default: 0,
      validate: deviceCountValidator
    }
  });

  // Apply index over name
  ProjectSchema.index({
    sortingName: 1
  });

  ProjectSchema.plugin(timestamps);

  module.exports = mongoose.model('Project', ProjectSchema);

})(require, module);
