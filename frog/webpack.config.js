const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const meteorExternals = require('webpack-meteor-externals');
const nodeExternals = require('webpack-node-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const babelConfig = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader?cacheDirectory=true',
    options: {
      plugins: [
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              '^imports': './imports',
              '^server': './server'
            }
          }
        ],
        '@babel/plugin-transform-flow-strip-types',
        '@babel/plugin-proposal-optional-chaining',
        ['@babel/plugin-proposal-class-properties', { loose: false }],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        [
          '@babel/plugin-proposal-nullish-coalescing-operator',
          { loose: false }
        ],
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        '@babel/plugin-proposal-json-strings',
        [
          '@babel/plugin-transform-modules-commonjs',
          {
            allowTopLevelThis: true
          }
        ],
        [
          'captains-log',
          {
            methods: ['debug', 'error', 'exception', 'log', 'warn']
          }
        ]
      ],
      presets: ['@babel/preset-env', '@babel/preset-react']
    }
  }
};

const clientConfig = {
  context: '/Users/stian/src/frog/frog',
  entry: './imports/ui/App/entrypoint.jsx',
  mode: 'development',
  module: {
    rules: [
      babelConfig,
      {
        test: /\.css$/,
        use: ['null-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/main.html'
    }),
    new webpack.HotModuleReplacementPlugin()
    // new BundleAnalyzerPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '^imports': './imports',
      '^server': './server'
    }
  },
  externals: [meteorExternals()],
  performance: { hints: false }
};

const serverConfig = {
  context: '/Users/stian/src/frog/frog',
  entry: ['./server/main.js'],
  mode: 'development',
  module: {
    rules: [
      babelConfig,
      {
        test: /\.css$/,
        use: ['null-loader']
      }
    ]
  },
  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '^imports': './imports',
      '^server': './server'
    }
  },
  externals: [meteorExternals(), nodeExternals()]
};

module.exports = [clientConfig, serverConfig];
