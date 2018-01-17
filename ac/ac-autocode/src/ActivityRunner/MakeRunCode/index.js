// @flow

import python from './Python';
import javascript from './Javascript';

const makeRunCode = (language: string) => {
  switch (language) {
    case 'python':
      return python();
    case 'javascript':
    default:
      return javascript();
  }
};

export default makeRunCode;
