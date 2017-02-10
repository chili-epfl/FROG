// @flow
import { useStrict } from 'mobx';
import { inject, observer } from 'mobx-react';
import Store from './store';

useStrict(true);

export const store = new Store();
export default Store;
window.store = store;

type FunctionComponent<P> = (props: P) => ?React$Element<P>;
type ClassComponent<D, P, S> = Class<React$Component<D, P, S>>;

export type StoreProp = { store: Store };

export function connect(component: any): any {
  return inject('store')(observer(component));
}
