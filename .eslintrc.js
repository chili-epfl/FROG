module.exports = {
  plugins: ['flowtype', 'prettier'],
  globals: {
    document: true,
    test: true,
    expect: true,
    history: true,
    window: true,
    FileReader: true,
    Blob: true,
    WebSocket: true,
    Presences: true,
    jest: true,
    Raven: true
  },
  rules: {
    'dot-notation': 'off',
    'func-names': 'off',
    'jsx-a11y/label-has-for': 'off',
    'react/require-default-props': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'consistent-return': 'off',
    'import/no-absolute-path': 'off',
    'no-else-return': 'off',
    'flowtype/space-after-type-colon': 'off',
    'class-methods-use-this': 'off',
    'no-confusing-arrow': 'off',
    'import/no-named-default': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/href-no-hash': 'off',
    'no-constant-condition': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-return-assign': 'off',
    'no-throw-literal': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '_',
        varsIgnorePattern: '_',
        ignoreRestSiblings: true
      }
    ],
    'no-use-before-define': 'off',
    'prefer-template': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/no-multi-comp': 'off',
    'react/prop-types': 'off',
    'react/sort-comp': 'off'
  },
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    es6: true,
    node: true,
    browser: true
  },
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/react'
  ]
};
