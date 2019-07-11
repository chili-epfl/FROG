import * as React from 'react';

import { isBrowser } from './isBrowser';

export default (isBrowser
  ? require('./client/ReactiveRichText/main').default // eslint-disable-line global-require
  : () => <p>Node</p>); // React component to make Flow happy, will never be shown
