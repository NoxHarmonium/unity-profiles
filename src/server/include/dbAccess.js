(function (require, module, process) {
  'use strict';

  var mongoose = require('mongoose-q')();
  var colors = require('colors');
  var config = require('../../shared/config.js');

  module.exports = {
    init: function (next) {
      // Mongoose functions wait for db connection to be open
      // so there is no need for a success callback
      // Thanks http://stackoverflow.com/a/14049430

      mongoose.connection.on('open', function (ref) {
        console.log('Connected to mongo server!'.green);
      });

      mongoose.connection.on('error', function (err) {
        console.log('Could not connect to mongo server!'.yellow);
        console.log(err.message.red);
        if (next) {
          next(err);
        }
      });

      var mongooseUrl = process.env.MONGO_URL || config.mongo_url;
      try {
        mongoose.connect(mongooseUrl);
        var db = mongoose.connection;
        console.log('Started connection on ' + (mongooseUrl)
          .cyan + ', waiting for it to open...'.grey);
      } catch (err) {
        console.log(('Setting up failed to connect to ' + mongooseUrl)
          .red, err.message);
        next(err);
      }
    }
  };



})(require, module, process);
