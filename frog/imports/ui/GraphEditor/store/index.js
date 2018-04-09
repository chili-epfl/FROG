// @flow

import { Meteor } from 'meteor/meteor';
import { configure} from 'mobx';
import { inject, observer } from 'mobx-react';
import Store from './store';

configure({enforceActions: true});

export const store = new Store();
export default Store;
if (Meteor.isClient) {
  window.store = store;
}

export type StoreProp = { store: Store };

export function connect(component: any): any {
  return inject('store')(observer(component));
}
