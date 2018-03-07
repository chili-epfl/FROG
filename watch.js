const chokidar = require('chokidar');
const { sync } = require('find-up');
const { dirname } = require('path');
const childProcess = require('child_process');

const dir = dirname(sync('.git'));

const pattern =
  process.argv[2] === 'all'
    ? ['ac/*/src/**', 'op/*/src/**', 'frog-utils/src/**']
    : `${process.argv[2]}/src`;

const transpile = (event, src) => {
  const dist = src.replace('/src/', '/dist/').replace('.jsx', '.js');

  childProcess.exec(
    `${dir}/node_modules/.bin/babel ${src} -o ${dist}`,
    error => {
      if (error) {
        log(`Babel error: ${error}`);
        return;
      }
      log(`${event}: ${src}->${dist}`);
    }
  );
};

const watcher = chokidar
  .watch(pattern, {
    persistent: true,
    cwd: dir,
    ignored: /\.(json|snap)/
  })
  .on('add', src => {
    transpile('add', src);
  })
  .on('change', src => {
    transpile('change', src);
  });

const log = console.info.bind(console);

process.on('SIGINT', () => {
  log('Quitting Watch');
  watcher.close();
  process.exit();
});
