// @flow

import { range } from 'lodash';

const randomString = (len: number) => {
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const randString = range(len)
    .map(_ => charSet.charAt(Math.floor(Math.random() * charSet.length)))
    .join('');

  // range(len).forEach(_ => {
  //   var randomPoz = Math.floor(Math.random() * charSet.length);
  //   randString += charSet.charAt(randomPoz);
  // });
  return randString;
};

export default {
  randomString
};
