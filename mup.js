module.exports = {
  servers: {
    digi5: {
      host: '207.154.210.149',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    },
    digi4: {
      host: '139.59.154.71',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    },
    digi3: {
      host: '165.227.166.123',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    },
    digi2: {
      host: '207.154.242.148',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    },
    digi1: {
      host: '207.154.211.32',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    }
  },

  app: {
    name: 'frog',
    path: 'frog',

    servers: {
      digi1: {
        env: {
          ROOT_URL: 'https://icchilisrv4.epfl.ch'
        }
      },
      digi2: {
        env: {
          ROOT_URL: 'https://icchilisrv4.epfl.ch'
        }
      },
      digi3: {
        env: {
          ROOT_URL: 'https://icchilisrv4.epfl.ch'
        }
      },
      digi4: {
        env: {
          ROOT_URL: 'https://icchilisrv4.epfl.ch'
        }
      },
      digi5: {
        env: {
          ROOT_URL: 'https://icchilisrv4.epfl.ch'
        }
      }
    },

    buildOptions: {
      serverOnly: true
    },

    env: {
      ROOT_URL: 'https://icchilisrv4.epfl.ch',
      MONGO_URL: 'mongodb://localhost:27500/meteor'
    },

    docker: {
      image: 'abernix/meteord:node-8.3.0-base',
      args: ['--network="host"']
    },

    enableUploadProgressBar: true
  }
};
