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
    },
    frog5: {
      host: 'frog5',
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
      frog4: {},
      frog5: {}
    },

    buildOptions: {
      serverOnly: true
    },

    env: {
      ROOT_URL: 'https://icchilisrv3.epfl.ch',
      MONGO_URL: 'mongodb://icchilisrv3.epfl.ch/meteor'
    },

    ssl: {
      autogenerate: {
        email: 'stian.haklev@epfl.ch',
        domains: 'icchilisrv3.epfl.ch'
      }
    },

    docker: {
      image: 'abernix/meteord:node-8.3.0-base',
      args: ['-p 3002:3002']
    },

    enableUploadProgressBar: true
  }
};
