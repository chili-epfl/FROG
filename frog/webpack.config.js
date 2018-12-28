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
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          },
          'sass-loader'
        ]
      },
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
    root: path.resolve(__dirname),
    extensions: ['', '.js', '.jsx'],
    alias: {
      imports: './imports',
      imports: './server'
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
    extensions: ['.js', '.jsx']
  },
  externals: [meteorExternals(), nodeExternals()],
  devServer: {
    hot: true,
    stats: 'minimal'
  }
};

module.exports = [clientConfig, serverConfig];