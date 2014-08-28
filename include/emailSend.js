(function (require, module) {
  'use strict';

  var colors = require('colors');
  var config = require('./config.js');
  var emailConfig = config.email_settings;
  var Q = require('q');

  if (!emailConfig.enabled) {
    console.log('Email sending not enabled in config.'.yellow);
    return;
  }

  // Persist connection ver multiple imports
  var emailjs = require('emailjs');

  console.log('Attemping to connect to smtp server at: ' +
    emailConfig.host + ':' + emailConfig.port);

  var server = emailjs.server.connect({
    user: emailConfig.user,
    password: emailConfig.password,
    host: emailConfig.host,
    port: emailConfig.port,
    ssl: emailConfig.ssl,
    tls: false
  });

  module.exports = {
    sendText: function (data, next) {
      var deferred = Q.defer();

      // Send simple text string in an email.
      // TODO: Implement templating
      if (!server) {
        console.log('Cannot send email: Email sending is disabled.'.red);
        deferred.resolve(); // Resolve instead of error because it is expected
        return;
      }

      server.send(data, function (err, message) {
        if (err) {
          deferred.reject(err);
        } else if (message) {
          deferred.resolve(message);
        }
      });

      return deferred.promise;
    }
  };

})(require, module);
