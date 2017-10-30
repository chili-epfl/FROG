module.exports = {
  servers: {
    frog1: {
      host: 'frog1',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    },
    frog2: {
      host: 'frog2',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    },
    frog3: {
      host: 'frog3',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    },
    frog4: {
      host: 'frog4',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    }
  },

  app: {
    name: 'frog',
    path: 'frog',

    servers: {
      frog1: {},
      frog2: {},
      frog3: {},
      frog4: {}
    },

    buildOptions: {
      serverOnly: true
    },

    env: {
      ROOT_URL: 'https://icchilisrv3.epfl.ch',
      MONGO_URL: 'mongodb://127.0.0.1:27017/meteor'
    },

    docker: {
      image: 'abernix/meteord:node-8.4.0-base',
      args: ['--network="host"']
    },

    enableUploadProgressBar: true
  }
};
