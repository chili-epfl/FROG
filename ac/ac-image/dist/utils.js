"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _resizeImg = _interopRequireDefault(require("@houshuang/resize-img"));

var _frogUtils = require("frog-utils");

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uploadBufferWithThumbnail = function uploadBufferWithThumbnail(imageBuffer, imageId, logger, dataFn, stream, uploadFn, type, filename) {
  logger({
    type: type,
    itemId: imageId,
    value: filename
  });
  var ext = filename && filename.split('.').pop();

  if (!filename || ['jpg', 'png'].includes(ext)) {
    // upload a thumbnail
    (0, _resizeImg.default)(imageBuffer, {
      width: 128
    }).then(function (buffer) {
      var blob = new Blob([buffer], {
        type: 'image/jpeg'
      });
      uploadFn(blob, imageId + 'thumb').then(function (url) {
        dataFn.objInsert(url, [imageId, 'thumbnail']);
        stream(url, [imageId, 'thumbnail']);
      });
    }); // upload a bigger picture

    (0, _resizeImg.default)(imageBuffer, {
      width: 800
    }).then(function (buffer) {
      var blob = new Blob([buffer], {
        type: 'image/jpeg'
      });
      uploadFn(blob, imageId).then(function (url) {
        dataFn.objInsert(url, [imageId, 'url']);
        stream(url, [imageId, 'url']);
      });
    });

    if (filename) {
      dataFn.objInsert(filename, [imageId, 'filename']);
      stream(filename, [imageId, 'filename']);
    }
  } else {
    uploadFn(imageBuffer, imageId).then(function (url) {
      dataFn.objInsert({
        url: url,
        ext: ext,
        filename: filename
      }, imageId);
      stream({
        url: url,
        ext: ext,
        filename: filename
      }, imageId);
    });
  }
};

var _default = function _default(file, logger, dataFn, stream, uploadFn, type) {
  var fr = new FileReader();
  var imageId = (0, _frogUtils.uuid)();
  dataFn.objInsert({
    votes: {},
    comment: _.DEFAULT_COMMENT_VALUE,
    key: imageId
  }, imageId);
  stream(imageId, [imageId, 'key']);
  var filename = file.name;

  fr.onloadend = function (loaded) {
    var imageBuffer = Buffer.from(loaded.currentTarget.result);
    uploadBufferWithThumbnail(imageBuffer, imageId, logger, dataFn, stream, uploadFn, type, filename);
  };

  fr.readAsArrayBuffer(file);
};

exports.default = _default;