const fs = require('fs-extra');
const stringify = require('json-stringify-pretty-compact');
const childProcess = require('child_process');
const path = require('path');

const rootpath = path.dirname(require.main.filename);

if (!process.argv[4]) {
  /*eslint-disable */
  console.log(`node createPackage.js <activity|operator> <short-name> <title>

Sets up a simple activity or operator package template in ./[ac|op]/<short-name>, and adds it to the relevant files
    (frog/package.json and frog/imports/[activity|operator]Packages.js). Also does the correct symlinking and yarn
    commands to be ready to develop.`);
  /*eslint-enable */
  process.exit();
}

const type = process.argv[2];
const prefix = type === 'activity' ? 'ac' : 'op';
if (process.argv[3].slice(0, 3) !== prefix + '-') {
  /*eslint-disable */
  console.log(
    `activityPackage names should start by 'ac-...' and operatorPackage names with 'op-...'.`
  );
  /*eslint-enable */
  process.exit();
}

const newActivityId = process.argv[3];

const camelCased = s => s.replace(/-([a-z])/g, g => g[1].toUpperCase());

const newActivityName = camelCased(newActivityId);

// adding to frog/package.json
const pkgjs = fs.readFileSync('./frog/package.json');
const pkg = JSON.parse(pkgjs);
pkg.dependencies[newActivityId] = '1.0.0';
fs.writeFileSync('./frog/package.json', stringify(pkg));

// adding to activityTypes | operatorTypes
const fname =
  type === 'activity'
    ? './frog/imports/activityTypes.js'
    : './frog/imports/operatorTypes.js';
const act = fs
  .readFileSync(fname)
  .toString()
  .split('\n');
act.splice(2, 0, `import ${newActivityName} from '${newActivityId}';`);
const whereToInsert = act.findIndex(x => x.startsWith('export const'));
act.splice(whereToInsert + 1, 0, `  ${newActivityName},`);
fs.writeFileSync(fname, act.join('\n'));

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

childProcess.execSync(`git add -N ./${prefix}/${newActivityId}`);

/*eslint-disable */
console.log(
  `Package created in './${prefix}/${newActivityId}', and added to ./frog. Please run 'killall -9 node; git clean -fdx; ./initial_setup.sh'
  from the repository root directory. Then you can restart './run_and_watch_all.sh', as well as 'meteor' in the './frog' directory,
  which should pick up the new ${type}. UUse 'git diff' to see all the changes that the script has made.`
);
/*eslint-enable */
