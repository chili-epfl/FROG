module.exports = {
  plugins: ['flowtype', 'prettier', 'react-hooks'],
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
    Raven: true,
    Meteor: true
  },
  rules: {
    'no-restricted-syntax': [
      'off',
      {
        selector: 'ForOfStatement'
      }
    ],
    'import/no-cycle': 'off',
    'no-alert': 'off',
    'react/no-array-index-key': 'off',
    'react/no-danger': 'off',
    'no-plusplus': 'off',
    'no-prototype-builtins': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react/prefer-stateless-function': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'dot-notation': 'off',
    'flowtype/generic-spacing': 'off',
    'flowtype/no-types-missing-file-annotation': 'off',
    'flowtype/space-after-type-colon': 'off',
    'func-names': 'off',
    'global-require': 'off',
    'import/extensions': 'off',
    'import/no-absolute-path': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-default': 'off',
    'import/no-unresolved': 'off',
    'import/order': ['error', { groups: ['builtin', 'external'] }],
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/aria-proptypes': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/heading-has-content': 'off',
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-confusing-arrow': 'off',
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-constant-condition': 'off',
    'no-else-return': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-restricted-globals': 'off',
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
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'react/button-has-type': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-no-target-blank': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-access-state-in-setstate': 'off',
    'react/no-multi-comp': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unused-prop-types': 'off',
    'react/no-unused-state': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
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
  ],
  overrides: [
    {
      files: ['**/__tests__/*.js'],
      env: {
        jest: true // now **/*.test.js files' env has both es6 *and* jest
      },
      plugins: ['jest'],
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error'
      }
    }
  ]
};
