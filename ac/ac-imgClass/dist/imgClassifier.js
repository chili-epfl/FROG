'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  max-width: 80%;\n  max-height: 100%;\n  position: relative;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n'], ['\n  max-width: 80%;\n  max-height: 100%;\n  position: relative;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  height: 90%;\n'], ['\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  height: 90%;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mousetrap = require('mousetrap');

var _mousetrap2 = _interopRequireDefault(_mousetrap);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var shortCuts = '1234567890abcdefghijklmnopqrstuvwxyz';

var ImgBis = _styledComponents2.default.img(_templateObject);

var FlexDiv = _styledComponents2.default.div(_templateObject2);

var ImgPanel = function ImgPanel(_ref) {
  var url = _ref.url;
  return _react2.default.createElement(
    'div',
    { style: { width: '90%', height: '100%' } },
    _react2.default.createElement(ImgBis, { alt: '', src: url })
  );
};

var ShortCutPanel = function ShortCutPanel(_ref2) {
  var categories = _ref2.categories,
      dataFn = _ref2.dataFn,
      images = _ref2.images,
      data = _ref2.data;
  return _react2.default.createElement(
    'div',
    { style: { width: '15%', height: '100%' } },
    _react2.default.createElement(
      'div',
      {
        className: 'list-group',
        style: {
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)'
        }
      },
      _react2.default.createElement(
        'div',
        {
          className: 'list-group-item',
          style: { fontWeight: 'bold', backgroundColor: '#D0D0D0' }
        },
        'Shortcuts :'
      ),
      categories.map(function (x, i) {
        return _react2.default.createElement(
          'button',
          {
            key: x,
            onClick: function onClick() {
              dataFn.objInsert({ url: images[data.index], category: x }, data.index);
              dataFn.objInsert(data.index + 1, 'index');
            },
            className: 'list-group-item'
          },
          shortCuts[i],
          ' ',
          _react2.default.createElement('span', { className: 'glyphicon glyphicon-arrow-right' }),
          ' ' + x
        );
      })
    )
  );
};

exports.default = function (_ref3) {
  var activityData = _ref3.activityData,
      data = _ref3.data,
      dataFn = _ref3.dataFn;

  var categ = activityData.config.categories || [];
  var imgs = Object.keys(data).filter(function (x) {
    return data[x].url !== undefined;
  }).map(function (x) {
    return data[x].url;
  });
  categ.forEach(function (x, i) {
    return _mousetrap2.default.bind(shortCuts[i], function () {
      dataFn.objInsert({ url: imgs[data.index], category: x }, data.index);
      dataFn.objInsert(data.index + 1, 'index');
    });
  });

  if (data.index === imgs.length) categ.forEach(function (x, i) {
    return _mousetrap2.default.unbind(shortCuts[i]);
  });
  return _react2.default.createElement(
    'div',
    { style: { margin: '1%', height: '100%' } },
    _react2.default.createElement(
      'h4',
      null,
      activityData.config.title
    ),
    data.index < imgs.length && _react2.default.createElement(
      FlexDiv,
      null,
      _react2.default.createElement(ImgPanel, { url: imgs[data.index] }),
      _react2.default.createElement(ShortCutPanel, {
        categories: categ,
        dataFn: dataFn,
        images: imgs,
        data: data
      })
    ),
    data.index >= imgs.length && _react2.default.createElement(
      'h1',
      null,
      'End of the activity'
    )
  );
};