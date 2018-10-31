Package.describe({
  name: 'qualia:one',
  version: '0.1.0',
  summary: 'Prevent two client bundles from being built.',
  git: 'http://github.com/qualialabs/one',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.4');

  api.use([
    'ecmascript',
    'underscore',
    'webapp',
  ], [ 'server' ]);

  api.mainModule('main.js', 'server');
});

/* This code monkey patches build process. It only works if the packages is locally installed. */
var bundleType = process.env.QUALIA_ONE_BUNDLE_TYPE;
if (bundleType === 'modern' || bundleType === 'legacy') {
  var path         = Npm.require('path'),
      mainModule   = global.process.mainModule,
      absPath      = mainModule.filename.split(path.sep).slice(0, -1).join(path.sep),
      require      = function(filePath) {
        return mainModule.require(path.resolve(absPath, filePath));
      },
      PlatformList = require('./project-context.js').PlatformList,
      getWebArchs  = PlatformList.prototype.getWebArchs,
      blacklist    = [
        bundleType === 'modern' ? 'web.browser.legacy' : 'web.browser'
      ]
  ;

  PlatformList.prototype.getWebArchs = function() {
    var archs = getWebArchs.apply(this, arguments);
    return archs.filter(arch => !blacklist.includes(arch));
  }
}
