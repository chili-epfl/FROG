// @flow

import { Meteor } from 'meteor/meteor';
import { useStrict, autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import Store from './store';
import { Activities } from '../../../api/activities';

useStrict(true);

export const store = new Store();
export default Store;
if (Meteor.isClient) {
  window.store = store;
}

export type StoreProp = { store: Store };

export function connect(component: any): any {
  return inject('store')(observer(component));
}

autorun(
  Meteor.bindEnvironment(() => {
    if (store.graphId) {
      console.log('triggered');
      Activities.find({}).observe({ changed: (e, x) => console.log(e, x) });
      Activities.find({}).observe(store.activityStore.mongoObservers);
    }
  })
);
