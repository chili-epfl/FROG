const fs = require('fs-extra');
const stringify = require('json-stringify-pretty-compact');
const childProcess = require('child_process');

if (!process.argv[4]) {
  /*eslint-disable */
  console.log(`
  usage: node createPackage.js <activity|operator> <short-name> <title>
  
  eg: To create an activity -> node createPackage.js activity ac-new-activity "A new activity" 

  Features: 
  * Sets up a simple activity or operator package template in ./[ac|op]/<short-name>.  
  * Adds it to the relevant files (frog/package.json and frog/imports/[activity|operator]Packages.js). 
  * Also does the correct symlinking and yarn commands to be ready to develop.`);
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
const camelCased = s => s.replace(/-([a-z])/g, g => g[1].toUpperCase());
const newActivityName = camelCased(newActivityId);

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

childProcess.execSync(`ln -s ../../${newActivityId} ./frog/node_modules/`);

childProcess.execSync(
  `git add ./${prefix}/${newActivityId} frog/package.json frog/imports/activityTypes.js frog/imports/operatorTypes.js`
);

/*eslint-disable */
console.log(
  `Package created in './${prefix}/${newActivityId}', and added to ./frog.

Use 'git diff --cached' to see all the changes that the script has made.`
);
