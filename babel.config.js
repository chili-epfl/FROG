module.exports = {
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-proposal-optional-chaining'
  ],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    ['@babel/preset-stage-0', { decoratorsLegacy: true }]
  ]
};
