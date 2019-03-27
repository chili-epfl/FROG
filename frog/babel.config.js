module.exports = api => ({
  plugins: [
    'macros',
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-json-strings',
    ...(api.env('test')
      ? [
          [
            '@babel/plugin-transform-runtime',
            {
              helpers: false,
              regenerator: true
            }
          ]
        ]
      : []),
    [
      'captains-log',
      {
        methods: ['debug', 'error', 'exception', 'log', 'warn']
      }
    ]
  ],
  presets: ['@babel/preset-env', '@babel/preset-react']
});
