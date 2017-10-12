module.exports = {
  servers: {
    one: {
      host: 'icchilisrv3.epfl.ch',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    }
  },

  app: {
    name: 'frog',
    path: 'frog',

    servers: {
      one: {}
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
