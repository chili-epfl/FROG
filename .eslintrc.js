module.exports = {
  plugins: ['flowtype', 'prettier'],
  globals: {
    window: true,
    document: true
  },
  rules: {
    'import/no-absolute-path': 'off',
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
    'no-unused-vars': ['error', { varsIgnorePattern: '_' }],
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
    node: true
  },
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/react'
  ]
};
