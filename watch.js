const chokidar = require('chokidar');
const { sync } = require('find-up');
const { dirname } = require('path');
const childProcess = require('child_process');
const fs = require('fs');

const dir = dirname(sync('.git'));

const pattern =
  process.argv[2] === 'all'
    ? ['ac/*/src/**', 'op/*/src/**', 'frog-utils/src/**']
    : `${process.argv[2]}/src`;

const build = process.argv[3] === 'build';

const dist = path => path.replace('/src/', '/dist/').replace('.jsx', '.js');

const transpile = (event, src) => {
  childProcess.exec(`cp ${src} ${dist(src)}.flow`);
  childProcess.exec(
    `${dir}/node_modules/.bin/babel ${src} -o ${dist(src)}`,
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

const rm = (event, src) => {
  if (event === 'file') fs.unlink(dist(src), err => deleteLogs(err, src));

  if (event === 'directory') fs.rmdir(dist(src), err => deleteLogs(err, src));
};

const mkdir = src => {
  fs.mkdir(dist(src), err => {
    if (err) {
      log(`addDir: ${src} failed.`);
    } else {
      log(`addDir: ${src}`);
    }
  });
};

const watcher = chokidar
  .watch(pattern, {
    persistent: true,
    cwd: dir,
    ignored: /\.(json|snap)/
  })
  .on('add', src => {
    if (build) rm('file', src);

    transpile('add', src);
  })
  .on('addDir', src => {
    mkdir(src);
  })
  .on('change', src => {
    transpile('change', src);
  })
  .on('unlink', src => {
    rm('file', src);
  })
  .on('unlinkDir', src => {
    rm('directory', src);
  });

const log = console.info.bind(console);

process.on('SIGINT', () => {
  log('Quitting Watch');
  watcher.close();
  process.exit();
});
