const childProcess = require('child_process');
const fs = require('fs-extra');
const stringify = require('json-stringify-pretty-compact');
const rimraf = require('rimraf');

if (!process.argv[4]) {
  /*eslint-disable */
  console.log(`
  usage: node createPackage.js <activity|operator> <short-name> <title>
  
  eg: To create an activity -> node createPackage.js activity ac-new-activity "A new activity" 

  Please stop Meteor before running this command (otherwise this command will crash Meteor).

  Features: 
  * Sets up a simple activity or operator package template in ./[ac|op]/<short-name>.  
  * Also does the correct symlinking to be ready to develop.`);
  /* eslint-enable */
  process.exit();
}

const type = process.argv[2];
const prefix = type === 'activity' ? 'ac' : 'op';
if (process.argv[3].slice(0, 3) !== prefix + '-') {
  /*eslint-disable */
  console.log(`
  activityPackage names should start by 'ac-...' and operatorPackage names with 'op-...'.
  `);
  /* eslint-enable */
  process.exit();
}

const newActivityId = process.argv[3];

if (fs.existsSync(`./${prefix}/${newActivityId}/package.json`)) {
  // eslint-disable-next-line no-console
  console.log(`Package already exists.`);
  process.exit();
}

fs.copySync(`./templates/${type}`, `./${prefix}/${newActivityId}`, {
  errorOnExist: true
});

// adding to ac/ac-new/package.json
const newpkgjs = fs.readFileSync(`./${prefix}/${newActivityId}/package.json`);
const newpkg = JSON.parse(newpkgjs);
newpkg.name = newActivityId;
fs.writeFileSync(
  `./${prefix}/${newActivityId}/package.json`,
  stringify(newpkg)
);

// modifying template src/index.js
const actnew = fs
  .readFileSync(`./${prefix}/${newActivityId}/src/index.js`)
  .toString()
  .split('\n');
const pos = actnew.findIndex(x => x.startsWith('  id:'));
actnew.splice(pos, 1, `  id: '${newActivityId}',`);

const pos1 = actnew.findIndex(x => x.startsWith('  name:'));
actnew.splice(pos1, 1, `  name: '${process.argv[4]}',`);
fs.writeFileSync(
  `./${prefix}/${newActivityId}/src/index.js`,
  actnew.join('\n')
);

childProcess.execSync(`ln -s ../${prefix}/${newActivityId} ./node_modules/`);

childProcess.execSync(
  `ln -s ../../node_modules/${newActivityId} ./frog/imports/packages/`
);

childProcess.execSync(
  `git add ./${prefix}/${newActivityId} ./frog/imports/packages/${newActivityId}`
);

[
  './frog/.meteor/local/build',
  './frog/.meteor/local/bundler-cache',
  './frog/.meteor/local/plugin-cache'
].forEach(x => rimraf.sync(x));

/*eslint-disable */
console.info(
  `Package created in './${prefix}/${newActivityId}', and added to ./frog.

Use 'git diff --cached' to see all the changes that the script has made.`
);
