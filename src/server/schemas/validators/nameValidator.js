(function (require, module) {
  'use strict';
  // Name Validator

  var validate = require('mongoose-validator');
  var pattern = /^([\u00c0-\u01ffa-zA-Z]+\b['\-]{0,1})+\b$/;

  module.exports = [
    validate({
      validator: 'isLength',
      arguments: [3, 40],
      message: 'Name should be between 3 and 50 characters'
    }),
    validate({
      validator: 'matches',
      arguments: [pattern, 'i'],
      message: 'Names should only use valid characters ' +
        '(a-z, apostrophe, hyphen)'
    })
  ];

})(require, module);
