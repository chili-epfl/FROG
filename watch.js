const chokidar = require('chokidar');
const { sync } = require('find-up');
const { dirname } = require('path');
const childProcess = require('child_process');
const fs = require('fs');

const dir = dirname(sync('.git'));

const pattern = ['ac/*/src/**', 'op/*/src/**', 'frog-utils/src/**'];

const distFlow = path => path.replace('/src/', '/dist/');
const dist = path => path.replace('/src/', '/dist/').replace('.jsx', '.js');

const transpile = (event, src) => {
  childProcess.exec(`cp ${src} ${distFlow(src)}.flow`);
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
  if (event === 'file') {
    fs.unlink(dist(src), err => deleteLogs(err, src));
    fs.unlink(`${dist(src)}.flow`, err => deleteLogs(err, src));
  }

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
    ignored: /\.(json|snap)/,
    ignoreInitial: true
  })
  .on('add', src => {
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
