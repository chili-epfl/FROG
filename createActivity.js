const fs = require('fs-extra');
const stringify = require('json-stringify-pretty-compact');
const readline = require('readline');
const childProcess = require('child_process');

if (!process.argv[2]) {
  // eslint-ignore-next-line
  console.log(`node createActivity.js <ac-short-name> <ac-title>

Sets up a simple activity package template in ./ac/<ac-short-name>, and adds it to the relevant files 
    (frog/package.json and frog/imports/activityPackages.js). Also does the correct symlinking and yarn 
    commands to be ready to develop.`);
  process.exit();
}

const newActivityId = process.argv[2];

const camelCased = s =>
  s.replace(/-([a-z])/g, function(g) {
    return g[1].toUpperCase();
  });

const newActivityName = camelCased(newActivityId);

// adding to frog/package.json
const pkgjs = fs.readFileSync('./frog/package.json');
const pkg = JSON.parse(pkgjs);
pkg.dependencies = Object.assign(pkg.dependencies, { [newActivityId]: '*' });
fs.writeFileSync('./frog/package.json', stringify(pkg));

// adding to activityTypes
const act = fs
  .readFileSync('./frog/imports/activityTypes.js')
  .toString()
  .split('\n');
act.splice(2, 0, `import ${newActivityName} from '${newActivityId}';`);
const whereToInsert = act.findIndex(x => x.startsWith('export const'));
act.splice(whereToInsert + 1, 0, `  ${newActivityName},`);
fs.writeFileSync('./frog/imports/activityTypes.js', act.join('\n'));

// copying template
fs.copySync('./templates/activity', `./ac/${newActivityId}`, {
  errorOnExist: true
});

// adding to frog/package.json
const newpkgjs = fs.readFileSync(`./ac/${newActivityId}/package.json`);
const newpkg = JSON.parse(newpkgjs);
newpkg1 = Object.assign(newpkg, {
  name: `${newActivityId}`
});
fs.writeFileSync(`./ac/${newActivityId}/package.json`, stringify(newpkg1));

// modifying template src/index.js

const actnew = fs
  .readFileSync(`./ac/${newActivityId}/src/index.js`)
  .toString()
  .split('\n');
const pos = actnew.findIndex(x => x.startsWith('  id:'));
actnew.splice(pos, 1, `  id: '${newActivityId}',`);

const pos1 = actnew.findIndex(x => x.startsWith('  name:'));
actnew.splice(pos1, 1, `  name: '${process.argv[3]}',`);
fs.writeFileSync(`./ac/${newActivityId}/src/index.js`, actnew.join('\n'));

childProcess.execSync(`git add -N ./ac/${newActivityId}`);

fs.ensureDirSync(`./ac/${newActivityId}/node_modules`);
fs.ensureDirSync(`./frog/node_modules`);

childProcess.execSync(
  `ln -s ../../../node_modules/* ../../../node_modules/.bin .`,
  { cwd: `./ac/${newActivityId}/node_modules/` }
);

childProcess.execSync(`ln -s ../../../frog-utils`, {
  cwd: `./ac/${newActivityId}/node_modules/`
});

childProcess.execSync(`ln -s ../../ac/${newActivityId} .`, {
  cwd: './frog/node_modules'
});

childProcess.execSync(`yarn`, { cwd: `./ac/${newActivityId}` });

// eslint-ignore-next-line
console.log(
  `Activity created in './ac/${newActivityId}', and added to ./frog, all symlinks set up, yarn has installed and built all files. 
Restart (or start) Meteor, run 'npm start watch' in ./ac/${newActivityId}/ and begin editing code. All changes will be 
instantly picked up by FROG. Use 'git diff' to see all the changes that the script has made.`
);
