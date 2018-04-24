// @flow
const fs = require('fs');
const chokidar = require('chokidar');
const childProcess = require('child_process');
const { sync } = require('find-up');
const { dirname } = require('path');

const dir = dirname(sync('.git'));

const command = process.argv[2];

const build = command === 'build';

const pattern =
  process.argv[3] === 'all'
    ? ['ac/*/src/**', 'op/*/src/**', 'frog-utils/src/**']
    : `${process.argv[2]}/src`;

const distPath = path => path.replace('/src/', '/dist/').replace('.jsx', '.js');

const transpile = (event, src) => {
  const dist = distPath(src);

  if (!fs.existsSync(dirname(dist))) {
    mkdir(dirname(dist));
  }

  childProcess.exec(`cp ${src} ${dist}.flow`);
  childProcess.exec(
    `${dir}/node_modules/.bin/babel ${src} -o ${dist}`,
    error => {
      if (error) {
        log(`Babel error: ${error}`);
        return;
      }
      log(`${event}: ${src}`);
    }
  );
};

const deleteLogs = (err, src) => {
  if (err) {
    log(`delete: ${src} failed.`);
  } else {
    log(`delete: ${src}`);
  }
};

// const rm = (event, src) => {
//   if (event === 'file') fs.unlink(dist(src), err => deleteLogs(err, src));

//   if (event === 'directory') fs.rmdir(dist(src), err => deleteLogs(err, src));
// };

const mkdir = path => {
  fs.mkdirSync(path);
};

const config = {
  persistent: !build,
  cwd: dir,
  ignored: /\.(json|snap)/,
  ignoreInitial: !build
};

const watcher = chokidar
  .watch(pattern, config)
  .on('add', src => {
    transpile('add', src);
  })
  .on('ready', () => {
    if (build) watcher.close();
  });

const log = console.info.bind(console);

process.on('SIGINT', () => {
  log('Quitting Watch');
  watcher.close();
  process.exit();
});
