(function (require, module) {
  'use strict';
  // Thanks 
  // http://stackoverflow.com/questions/14588032/mongoose-password-hashing

  var mongoose = require('mongoose-q')();
  var bcrypt = require('bcrypt');
  var config = require('../../shared/config.js');
  var Schema = mongoose.Schema;
  var uuid = require('node-uuid');

  var emailValidator = require('validators/emailValidator.js');
  var nameValidator = require('validators/nameValidator.js');
  var passwordValidator = require('validators/passwordValidator.js');
  var apiKeyValidator = require('validators/apiKeyValidator.js');

  var UserSchema = new Schema({
    _id: {
      type: String,
      required: true,
      trim: true,
      validate: emailValidator
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: passwordValidator
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      validate: nameValidator
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      validate: nameValidator
    },
    tempPasswordCode: {
      type: String,
      trim: true
    },
    passwordExpiry: {
      type: Date
    },
    apiKey: {
      type: String,
      default: uuid.v4,
      unique: true,
      trim: true,
      validate: apiKeyValidator
    }

  });

  UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) {
      return next();
    }

    bcrypt.genSalt(config.salt_work_factor, function (err, salt) {
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }

        user.password = hash;
        next();

      });
    });
  });

  UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    if (!candidatePassword) {
      cb(new Error('Cannot compare a null password'));
    }

    if (!this.password) {
      cb(new Error(
        'Cannot compare password on a user object with an undefined password'
      ));
    }

    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };

  module.exports = mongoose.model('User', UserSchema);

})(require, module);
