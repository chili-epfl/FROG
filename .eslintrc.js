module.exports = {
  plugins: ['flowtype', 'prettier'],
  globals: {
    window: true,
    document: true
  },
  rules: {
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', { varsIgnorePattern: '_' }],
    'import/prefer-default-export': 'off',
    'prefer-template': 'off',
    'react/prop-types': 'off',
    'react/sort-comp': 'off',
    'react/no-multi-comp': 'off',
    'jsx-a11y/href-no-hash': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-wrap-multilines': 'off',
    'no-return-assign': 'off',
    'no-throw-literal': 'off',
    'no-use-before-define': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-nested-ternary': 'off',
    'no-constant-condition': 'off'
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
    node: true
  },
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/react'
  ]
};
