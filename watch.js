const chokidar = require('chokidar');
const { sync } = require('find-up');
const { dirname, join } = require('path');
const childProcess = require('child_process');

const dir = dirname(sync('.git'));

const pattern =
  process.argv[2] === 'all'
    ? ['ac/*/src/**', 'op/*/src/**', 'frog-utils/src/**']
    : `${process.argv[2]}/src`;

const watcher = chokidar.watch(pattern, {
  persistent: true,
  cwd: dir
});

const log = console.log.bind(console);

watcher.on('change', path => {
  const pkgDirSrc = dirname(path);
  const pkgDirDest = pkgDirSrc.replace('src', 'dist');
  childProcess.exec(
    `${dir}/node_modules/.bin/babel ${pkgDirSrc} --out-dir ${pkgDirDest}`,
    (error, stdout) => {
      if (error) {
        log(`Babel error: ${error}`);
        return;
      }
      log(`${stdout}`);
    }
  );
});

process.on('SIGINT', () => {
  log('Quitting Watch');
  watcher.close();
  process.exit();
});
