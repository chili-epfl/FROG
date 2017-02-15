// @flow
import { useStrict } from 'mobx';
import { inject, observer } from 'mobx-react';
import Store from './store';

useStrict(true);

export const store = new Store();
window.store = store;

export function connect<Props>(
  component: (o: Object) => React$Element<any>
): React$Element<null, Props & { store: typeof Store }, null> {
  return inject('store')(observer(component));
}
