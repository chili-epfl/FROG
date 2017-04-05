// @flow
import { useStrict, autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import Store from './store';

useStrict(true);

export const store = new Store();
export default Store;
window.store = store;
window.autorun = autorun;

export type StoreProp = { store: Store };

export function connect(component: any): any {
  return inject('store')(observer(component));
}
