(function (require, describe, it) {
  'use strict';
  var utils = require('../src/shared/utils.js');
  var expect = require('expect.js');

  var arrayA = [{
    a: 1,
    b: '2',
    c: {
      d: 4,
      e: 5
    },
    f: [1, 2, 3]
  }, {
    a: 11,
    b: '22',
    c: {
      d: 44,
      e: 55
    },
    f: [11, 22, 33]
  }, {
    a: 111,
    b: '222',
    c: {
      d: 444,
      e: 555
    },
    f: [111, 222, 333]
  }];

  // Same as A but rearranged
  var arrayB = [{
      f: [111, 222, 333],
      a: 111,
      b: '222',
      c: {
        d: 444,
        e: 555
      }
    }, {
      a: 1,
      b: '2',
      c: {
        d: 4,
        e: 5
      },
      f: [1, 2, 3]
    }, {
      a: 11,
      c: {
        d: 44,
        e: 55
      },
      f: [11, 22, 33],
      b: '22'

    }

  ];

  // Different to both a and b
  var arrayC = [{
    a: 1,
    b: '2',
    c: {
      d: 4,
      e: 5
    },
    f: [1, 9, 3]
  }, {
    a: 11,
    b: '22',
    c: {
      d: 14,
      e: 55
    },
    f: [11, 22, 33]
  }, {
    a: 111,
    b: '232',
    c: {
      d: 444,
      e: 555
    },
    f: [111, 222, 333]
  }];

  var objA = {
    a: 56,
    b: 67,
    c: {
      d: 'test',
      e: {},
      f: [3, 5, 5]
    }
  };

  var objB = {
    a: 56,
    b: 67,
    c: {
      d: 'test',
      e: {},
      f: [3, 5, 5]
    }
  };

  var objC = {
    a: 23,
    b: 67,
    c: {
      d: 'testdd',
      e: {},
      f: [3, 9, 5]
    }
  };

  describe('arrayMatch tests', function () {

    it('(objA, objA) === true', function () {
      expect(utils.objMatch(objA, objA))
        .to.be.ok();
    });

    it('(objA, objB) === true', function () {
      expect(utils.objMatch(objA, objB))
        .to.be.ok();
    });

    it('(objA, objC) === false', function () {
      expect(utils.objMatch(objA, objB))
        .to.be.ok();
    });

    it('(objA, objC) === false', function () {
      expect(utils.objMatch(objA, objB))
        .to.be.ok();
    });

    it('(objA, null) === false', function () {
      expect(utils.objMatch(objA, objB))
        .to.be.ok();
    });

    it('(null, objA) === false', function () {
      expect(utils.objMatch(objA, objB))
        .to.be.ok();
    });

  });

  describe('arrayMatch tests', function () {

    it('(arrayA, null) === false', function () {
      expect(utils.arrayMatch(arrayA, null))
        .to.be(false);
    });

    it('(null, arrayA) === false', function () {
      expect(utils.arrayMatch(null, arrayA))
        .to.be(false);
    });

    it('(null, null) === true', function () {
      expect(utils.arrayMatch(null, null))
        .to.be(true);
    });

    it('(arrayA, arrayA) === true', function () {
      expect(utils.arrayMatch(arrayA, arrayA))
        .to.be(true);
    });

    it('(arrayA, arrayB) === true', function () {
      expect(utils.arrayMatch(arrayA, arrayB))
        .to.be(true);
    });

    it('(arrayA, arrayC) === false', function () {
      expect(utils.arrayMatch(arrayA, arrayC))
        .to.be(false);
    });

  });

  describe('exists(x) tests', function () {

    it('exists(undefined) === false', function () {
      var x;
      expect(utils.exists(x))
        .to.be(false);
    });

    it('exists(null) === false', function () {
      expect(utils.exists(null))
        .to.be(false);
    });

    it('exists(false) === true', function () {
      expect(utils.exists(false))
        .to.be(true);
    });

    it('exists({}}) === true', function () {
      var x = {};
      expect(utils.exists(x))
        .to.be(true);
    });

  });

  describe('isNonEmptyString(x) tests', function () {

    it('isNonEmptyString(undefined) === false', function () {
      var x;
      expect(utils.isNonEmptyString(x))
        .to.be(false);
    });

    it('isNonEmptyString(null) === false', function () {
      expect(utils.isNonEmptyString(null))
        .to.be(false);
    });

    it('isNonEmptyString(false) === false', function () {
      expect(utils.isNonEmptyString(false))
        .to.be(false);
    });

    it('isNonEmptyString({}) === false', function () {
      var x = {};
      expect(utils.isNonEmptyString(x))
        .to.be(false);
    });
    it('isNonEmptyString(5) === false', function () {
      var x = 5;
      expect(utils.isNonEmptyString(x))
        .to.be(false);
    });

    it('isNonEmptyString(\'\') === false', function () {
      var x = '';
      expect(utils.isNonEmptyString(x))
        .to.be(false);
    });

    it('isNonEmptyString(\'abcd\') === true', function () {
      var x = 'abcd';
      expect(utils.isNonEmptyString(x))
        .to.be(true);
    });

  });

  describe('isNonEmptyString(x) tests', function () {

    it('copyArray(undefined) === undefined', function () {
      var x;
      expect(utils.copyArray(x))
        .to.be(null);
    });

    it('copyArray(null) === null', function () {
      var x = null;
      expect(utils.copyArray(x))
        .to.be(null);
    });

    it('copyArray({key:\'value\'}) === null', function () {
      var x = {
        key: 'value'
      };
      expect(utils.copyArray(x))
        .to.be(null);
    });

    it('copyArray(5) === null', function () {
      var x = 5;
      expect(utils.copyArray(x))
        .to.be(null);
    });

    it('copyArray(true) === null', function () {
      var x = true;
      expect(utils.copyArray(x))
        .to.be(null);
    });

    it('copyArray(\'string\') === null', function () {
      var x = 'string';
      expect(utils.copyArray(x))
        .to.be(null);
    });

    it('copyArray([1,2,3,4]) === [1,2,3,4]', function () {
      var x = [1, 2, 3, 4];
      var y = utils.copyArray(x);
      expect(y)
        .to.be.an('array');
      y.push(5);
      expect(x)
        .to.eql([1, 2, 3, 4]);
      expect(y)
        .to.eql([1, 2, 3, 4, 5]);

    });

  });




})(require, describe, it);
