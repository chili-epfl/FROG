'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var splitAt = function splitAt(i, xs) {
  var a = xs.slice(0, i);
  var b = xs.slice(i, xs.length);
  return [a, b];
};

var shuffle = function shuffle(xs) {
  return xs.slice(0).sort(function () {
    return .5 - Math.random();
  });
};

var zip = function zip(xs) {
  return xs[0].map(function (_, i) {
    return xs.map(function (x) {
      return x[i];
    });
  });
};

var config = exports.config = {
  title: 'Configuration for Random Group Formation',
  type: 'object',
  properties: {
    'groupSize': {
      type: 'number',
      title: 'Group size'
    }
  }
};

// Obviously assumes even array
var operator = exports.operator = function operator(names) {
  return zip(splitAt(names.length / 2, shuffle(names)));
};

exports.default = { id: 'op-random', operator: operator, config: config };