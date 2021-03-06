/*
 * Profile Business Logic
 */

(function (require, module) {

  'use strict';

  var Project = require('../schemas/project.js');
  var Profile = require('../schemas/profile.js');
  var Device = require('../schemas/device.js');
  var User = require('../schemas/user.js');
  var moment = require('moment');
  var passport = require('passport');
  var testData = require('../../../tests/testData.js');
  var config = require('../../shared/config.js');
  var mongoose = require('mongoose-q')();
  var Q = require('q');
  var utils = require('../../shared/utils.js');
  var _ = require('lodash');
  var queryFilters = require('../include/queryFilters.js');

  module.exports = {

    //
    // Query Parameters
    //

    qDeviceId: function (req, res, next) {
      var deviceId = req.query.deviceId;
      if (deviceId) {
        Device.findOneQ({
          _id: deviceId
        })
          .then(function (device) {
            req.device = device;
            next();
          })
          .fail(function (err) {
            next(err);
          })
          .done();
      } else {
        next();
      }
    },

    //
    // Parameters
    //

    pProfileId: function (req, res, next, profileId) {
      // Check for valid object ID
      // Thanks: http://stackoverflow.com/a/14942113/1153203
      if (!profileId.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
      }

      Profile.findOneQ({
        '_id': profileId
      })
        .then(function (data) {
          req.profile = data;
          next();
        })
        .catch(function (err) {
          next(err);
        })
        .done();
    },

    //
    // API Methods
    //

    getProfile: function (req, res, next) {
      var profile = req.profile;
      var project = req.project;
      var loggedInUser = req.user;

      if (!project) {
        return res.status(404)
          .send({
            detail: 'Specified project doesn\'t exist'
          });
      }

      if (!profile) {
        return res.status(404)
          .send({
            detail: 'Profile doesn\'t exist'
          });
      }

      res.status(200)
        .send({
          data: {
            projectId: profile.projectId,
            projectVersion: profile.projectVersion,
            profileName: profile.profileName,
            profileData: profile.profileData,
            owner: profile.owner,
            updatedAt: profile.updatedAt
          }
        });
    },

    getProfiles: function (req, res, next) {
      var project = req.project;
      var loggedInUser = req.user;
      var projectVersion = req.query.projectVersion;

      if (!project) {
        return res.status(404)
          .send({
            detail: 'Specified project doesn\'t exist'
          });
      }

      var countTotalRecords = Q.try(function () {
        return Profile.countQ({
          projectId: project._id
        });
      });

      var getPaginatedRecords = Q.try(function () {

        var query = Profile.find({
          projectId: project._id
        });

        query.select('_id projectId projectVersion profileName ' +
          'profileData updatedAt owner');

        if (utils.exists(projectVersion)) {
          query.where('projectVersion')
            .equals(projectVersion);
        }

        queryFilters.paginate(req.query, query);
        queryFilters.sort(req.query, query, {
          'profileName': 'asc'
        });

        return query.execQ();

      });

      Q.all([countTotalRecords, getPaginatedRecords])
        .spread(function (totalRecordCount, profiles) {
          res.status(200)
            .send({
              data: profiles,
              control: {
                recordsSent: profiles.length,
                totalRecords: totalRecordCount
              }
            });

        })
        .catch(function (err) {
          next(err);
        })
        .done();
    },

    saveProfile: function (req, res, next) {
      var project = req.project;
      var device = req.device;
      var loggedInUser = req.user;
      var data = req.body;
      var profileName = data.profileName;

      if (!device) {
        return res.status(409)
          .send({
            detail: 'No valid device ID specified in query string. ' +
              '(eg. .../profiles/?deviceId=xxx)'
          });
      }

      if (!project) {
        return res.status(404)
          .send({
            detail: 'Specified project doesn\'t exist'
          });
      }

      if (!utils.isNonEmptyString(profileName)) {
        return res.status(409)
          .send({
            detail: 'A projectName field is required'
          });
      }

      if (device.sessionUser !== loggedInUser._id) {
        return res.status(401)
          .send({
            detail: 'Logged in user is not in current session ' +
              'with this device.'
          });
      }

      var p = new Profile({
        projectId: project._id,
        projectVersion: device.projectVersion,
        profileName: data.profileName,
        profileData: device.currentState,
        owner: loggedInUser._id
      });

      p.saveQ()
        .then(function (savedProfile) {
          res.status(200)
            .send({
              data: {
                _id: savedProfile._id
              }
            });
        })
        .catch(function (err) {
          next(err);
        })
        .done();
    },

    deleteProfile: function (req, res, next) {
      var profile = req.profile;
      var project = req.project;
      var loggedInUser = req.user;

      if (!project) {
        return res.status(404)
          .send({
            detail: 'Specified project doesn\'t exist'
          });
      }

      if (!profile) {
        return res.status(404)
          .send({
            detail: 'Profile doesn\'t exist'
          });
      }

      if (!(_.contains(project.admins, loggedInUser._id) ||
        (profile.owner === loggedInUser._id))) {
        return res.status(401)
          .send({
            detail: 'Only authorised profile owner or a project' +
              'admin can delete a profile.'
          });
      }

      profile.removeQ()
        .then(function () {
          res.status(200)
            .send();
        })
        .catch(function (err) {
          next(err);
        })
        .done();

    },

    //
    // Test extensions
    //
    resetTests: function (req, res, next) {
      Profile.removeQ({})
        .then(function () {
          res.status(200)
            .send();
        })
        .catch(function (err) {
          next(err);
        })
        .done();
    }


  };

})(require, module);
