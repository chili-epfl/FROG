// @flow
import React, { Component } from 'react';
import { store } from '../store';

export const timeToPx = (time: number, scale: number): number =>
  time * 3900 * scale / 120;
export const pxToTime = (px: number, scale: number): number =>
  px / 3900 / scale * 120;
export const timeToPxScreen = (time: number): number =>
  time * 3900 * store.ui.scale / 120 - store.ui.panx * 4 * store.ui.scale;

export const between = (
  rawminval: number,
  rawmaxval: number,
  x: number
): number => {
  const minval = rawminval || 0;
  const maxval = rawmaxval || 99999;
  return Math.min(Math.max(x, minval), maxval);
};

export const S = (obj, options) => {
  options = options || {};
  var indent = JSON.stringify([1], null, get(options, 'indent', 2))
    .slice(2, -3);
  var maxLength = indent === '' ? Infinity : get(options, 'maxLength', 80);
  return (function _stringify(obj, currentIndent, reserved) {
    if (obj && typeof obj.toJSON === 'function') {
      obj = obj.toJSON();
    }
    var string = JSON.stringify(obj);
    if (string === undefined) {
      return string;
    }
    var length = maxLength - currentIndent.length - reserved;
    if (string.length <= length) {
      var prettified = prettify(string);
      if (prettified.length <= length) {
        return prettified;
      }
    }
    if (typeof obj === 'object' && obj !== null) {
      var nextIndent = currentIndent + indent;
      var items = [];
      var delimiters;
      var comma = function(array, index) {
        return index === array.length - 1 ? 0 : 1;
      };
      if (Array.isArray(obj)) {
        for (var index = 0; index < obj.length; index++) {
          items.push(
            _stringify(obj[index], nextIndent, comma(obj, index)) || 'null'
          );
        }
        delimiters = '[]';
      } else {
        Object.keys(obj).forEach(function(key, index, array) {
          var keyPart = JSON.stringify(key) + ': ';
          var value = _stringify(
            obj[key],
            nextIndent,
            keyPart.length + comma(array, index)
          );
          if (value !== undefined) {
            items.push(keyPart + value);
          }
        });
        delimiters = '{}';
      }
      if (items.length > 0) {
        return [
          delimiters[0],
          indent + items.join(',\n' + nextIndent),
          delimiters[1]
        ].join('\n' + currentIndent);
      }
    }
    return string;
  })(obj, '', 0);
};
var stringOrChar = /("(?:[^"]|\\.)*")|[:,]/g;
function prettify(string) {
  return string.replace(stringOrChar, function(match, string) {
    return string ? match : match + ' ';
  });
}
function get(options, name, defaultValue) {
  return name in options ? options[name] : defaultValue;
}
