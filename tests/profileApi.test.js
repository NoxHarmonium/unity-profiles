(function (require, describe, it) {
  'use strict';

  var superagent = require('superagent');
  var expect = require('expect.js');
  var testData = require('./testData.js');
  var utils = require('../include/utils.js');
  var serverModule = require('../server.js');

  describe('Project API tests', function () {
    var id;
    var users = testData.getTestUsers();
    var projects = testData.getTestProjects();
    var profiles = testData.getTestProfiles();
    var devices = testData.getTestDevices();
    var agent = superagent.agent();
    var project = null;
    var profileId = null;
    var device = null;

    it('Start server', function (done) {
      serverModule.start(function (e, server) {
        expect(e)
          .to.eql(null);

        done();
      });
    });

    it('Login user [2]', function (done) {
      agent.post('http://localhost:3000/login/')
        .send(users[2])
        .end(function (e, res) {
          expect(e)
            .to.eql(null);
          expect(res.status)
            .to.be(200);
          done();
        });
    });

    it('Get project created by device API tests', function (done) {
      agent.get('http://localhost:3000/projects/')
        .end(function (e, res) {
          expect(e)
            .to.eql(null);
          expect(res.ok)
            .to.be.ok();
          expect(res.body.length)
            .to.be(1);

          project = res.body[0];

          done();
        });
    });

    it('Get device created by device API tests', function (done) {
      agent.get('http://localhost:3000/projects/' +
        project._id + '/devices/' + devices[0].macAddress + '/')
        .end(function (e, res) {
          expect(e)
            .to.eql(null);
          expect(res.ok)
            .to.be.ok();

          device = res.body;

          done();
        });
    });

    it('Save current session as profile [0]', function (done) {
      var data = {
        profileName: 'test profile 1'
      };

      agent.put('http://localhost:3000/projects/' +
        device.projectId + '/profiles/')
        .query({
          deviceId: device._id
        })
        .send(data)
        .end(function (e, res) {
          expect(e)
            .to.eql(null);
          expect(res.ok)
            .to.be.ok();
          expect(res.body._id)
            .to.be.ok();

          profileId = res.body._id;

          done();
        });
    });

    it('Retrieve profile [0]', function (done) {

      agent.get('http://localhost:3000/projects/' +
        device.projectId + '/profiles/' + profileId + '/')
        .end(function (e, res) {
          expect(e)
            .to.eql(null);
          expect(res.ok)
            .to.be.ok();

          var profile = res.body;

          expect(utils.objMatch(
            device.currentState,
            profile.profileData))
            .to.be.ok();

          done();
        });
    });

  });

})(require, describe, it);
