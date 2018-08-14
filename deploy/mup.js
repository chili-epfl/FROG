const fs = require('fs');
const childProcess = require('child_process');
const rimraf = require('rimraf');

module.exports = {
  servers: {
    frog1: {
      host: 'frog1',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    },
    dbredis: {
      host: 'dbredis',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    }
  },

  app: {
    name: 'frog',
    path: '../frog/frog',

    servers: {
      frog1: {},
      dbredis: { settings: 'dbredis-settings.json' }
    },

    buildOptions: {
      serverOnly: true
    },

    env: {
      ROOT_URL: 'https://icchilisrv3.epfl.ch',
      MONGO_URL: 'mongodb://127.0.0.1:27017/meteor'
    },

    docker: {
      image: 'abernix/meteord:node-8.11.2-base',
      args: ['--network="host"']
    },

    enableUploadProgressBar: true
  },
  hooks: {
    'pre.reconfig': function(api) {
      // Same api as is given to plugin command handlers
      // If this runs asynchronous tasks, it needs to return a promise.
      const gitHash = childProcess
        .execSync('git rev-parse HEAD')
        .toString()
        .trim();

      api.getSettings();
      api.settings.GIT_HASH = gitHash;
    },
    'pre.deploy': function() {
      rimraf.sync('../frog/frog/public/clientFiles');
      fs.mkdirSync('../frog/frog/public/clientFiles');
      fs.readdirSync('../frog/op').forEach(x => {
        if (fs.existsSync(`../frog/op/${x}/clientFiles`)) {
          fs.symlinkSync(
            `../../../op/${x}/clientFiles`,
            `../frog/frog/public/clientFiles/${x}`
          );
        }
      });
      fs.readdirSync('../frog/ac').forEach(x => {
        if (fs.existsSync(`../frog/ac/${x}/clientFiles`)) {
          fs.symlinkSync(
            `../../../ac/${x}/clientFiles`,
            `../frog/frog/public/clientFiles/${x}`
          );
        }
      });
    }
  }
};
