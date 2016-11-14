'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActivityRunner = exports.config = exports.meta = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJsonschemaForm = require('react-jsonschema-form');

var _reactJsonschemaForm2 = _interopRequireDefault(_reactJsonschemaForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var meta = exports.meta = {
  name: 'Simple form',
  type: 'react-component'
};

var config = exports.config = {
  title: "MCQ",
  type: "array",
  items: {
    type: "object",
    title: "New Question",
    required: [
      "title"
    ],
    properties: {
      title: {
        type: "string",
        title: "Question"
      },
      answers: {
        type: "array",
        title: "Possible answers",
        items: {
          type: "object",
          required: [
            "title"
          ],
          properties: {
            title: {
              type: "string",
              title: "Answer"
            },
            answer: {
              type: "boolean",
              title: "This is an answer",
              default: false
            }
          }
        }
      },
      details: {
        type: "string",
        title: "Enter an explanation",
      }
    }
  }
};

// Obviously assumes even array
var ActivityRunner = exports.ActivityRunner = function ActivityRunner(_ref) {
  var config = _ref.config,
      logger = _ref.logger,
      result = _ref.result;

  var propdef = config.questions.split(',').reduce(function (acc, x, i) {
    return _extends({}, acc, _defineProperty({}, i + '', { type: 'string', title: x }));
  }, {});
  var formdef = {
    title: config.title,
    type: 'object',
    properties: propdef
  };
  return _react2.default.createElement(_reactJsonschemaForm2.default, { schema: formdef, onSubmit: result, onChange: function onChange(x) {
      return logger('form changed: ' + JSON.stringify(x));
    } });
};

exports.default = { id: 'ac-form', meta: meta, config: config, ActivityRunner: ActivityRunner };