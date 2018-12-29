const webpack = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
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
      presets: [['@babel/env'], '@babel/react'],
      plugins: [
        'macros',
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
          'captains-log',
          {
            methods: ['debug', 'error', 'exception', 'log', 'warn']
          }
        ]
      ]
    }
  }
};

const clientConfig = {
  entry: './imports/ui/App/entrypoint.jsx',
  mode: 'development',
  module: {
    rules: [
      babelConfig,
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  node: {
    fs: 'empty',
    module: 'empty'
  },
  output: {
    publicPath: '/'
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './client/main.html'
    }),
    new webpack.HotModuleReplacementPlugin()
    // new BundleAnalyzerPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '*'],
    alias: {
      '^imports/(.+)': './imports/\\1',
      '^server/(.+)': './server/\\1'
    }
  },
  externals: [meteorExternals() /*nodeExternals()*/],
  devServer: {
    hot: true
    // logLevel: 'warn',
    // stats: 'minimal'
  },
  performance: { hints: false }
};

const serverConfig = {
  entry: ['./server/main.js'],
  // output: { filename: 'server' },
  plugins: [
    new HardSourceWebpackPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
  ],
  mode: 'development',
  node: {
    fs: 'empty',
    module: 'empty'
  },
  output: {
    publicPath: '/'
  },
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
    extensions: ['.js', '.jsx', '*'],
    alias: {
      '^imports': './imports',
      '^server': './server'
    }
  },
  devServer: {
    hot: true
  },
  externals: [
    meteorExternals(),
    // nodeExternals()
    nodeExternals({ whitelist: ['frog-utils', /^ac-/, /^op-/] })
  ]
};

module.exports = [clientConfig, serverConfig];
