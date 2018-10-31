import { WebApp } from "meteor/webapp";

let bundleType = process.env.QUALIA_ONE_BUNDLE_TYPE;
if (bundleType === 'modern') {
  // In order for this to work, the qualia:one package must be loaded very early on.
  // Ideally it should be moved to the top of .meteor/packages
  WebApp.defaultArch = 'web.browser';
}
