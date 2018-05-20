module.exports = {
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'captains-log',
      {
        methods: ['debug', 'error', 'exception', 'log', 'warn']
      }
    ]
  ],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    ['@babel/preset-stage-0', { decoratorsLegacy: true }]
  ]
};
