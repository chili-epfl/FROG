// @flow

/***
 * This file specifies a number of components that should only be available when
 * frog-utils is accessed from a browser instance. If this is not the case, the
 * components will be replace with dummy alternatives.
 */

import * as React from 'react';

import { isBrowser } from './isBrowser';

export const ReactJsonView = isBrowser
  ? require('react-json-view').default // eslint-disable-line global-require
  : () => <p>Node</p>; // React component to make Flow happy, will never be shown

export const EnhancedForm = isBrowser
  ? require('./EnhancedForm.js').default // eslint-disable-line global-require
  : () => <p>Node</p>; // React component to make Flow happy, will never be shown

export const ReactiveRichText = isBrowser
  ? require('./ReactiveRichText/main').default // eslint-disable-line global-require
  : () => <p>Node</p>; // React component to make Flow happy, will never be shown
