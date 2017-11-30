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
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'dot-notation': 'off',
    'flowtype/space-after-type-colon': 'off',
    'func-names': 'off',
    'import/extensions': 'off',
    'import/no-absolute-path': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-default': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/label-has-for': 'off',
    'no-confusing-arrow': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-constant-condition': 'off',
    'no-else-return': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-return-assign': 'off',
    'no-throw-literal': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', { varsIgnorePattern: '_' }],
    'no-use-before-define': 'off',
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/no-multi-comp': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unused-state': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/sort-comp': 'off',
    'sx-a11y/mouse-events-have-key-events': 'off'
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
