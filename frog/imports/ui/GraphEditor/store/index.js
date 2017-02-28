// @flow
import { useStrict, autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import { S } from '../utils';
import Store from './store';

useStrict(true);

export const store = new Store();
export default Store;
window.store = store;

export type StoreProp = { store: Store };

export function connect(component: any): any {
  return inject('store')(observer(component));
}

window.storeDebug = () =>
  autorun(() => console.log(S({ ...window.store, history: [] })));
