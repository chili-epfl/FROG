// @flow
import { computed, action, observable } from 'mobx';
import { omit } from 'lodash';
import { store } from './index';
import Operator from './operator';

export type OperatorTypes = 'product' | 'social';

export default class OperatorStore {
  @observable all: Array<Operator> = [];
  @action mongoAdd = (x: any) => {
    if (!store.findId({ type: 'operator', id: x._id })) {
      this.all.push(new Operator(x.time, x.y, x.type, x._id, x.title));
    }
  };
  @action mongoChange = (newx, oldx) => {
    store.findId({ type: 'operator', id: oldx._id }).update(newx);
  };

  @action mongoRemove = remx => {
    this.all = this.all.filter(x => x.id !== remx._id);
  };

  @computed
  get mongoObservers() {
    return {
      added: this.mongoAdd,
      changed: this.mongoChange,
      removed: this.mongoRemove
    };
  }

  @action place = (type: OperatorTypes): void => {
    if (store.state.mode === 'normal') {
      store.state = { mode: 'placingOperator', operatorType: type };
    }
  };

  @computed
  get history(): Array<any> {
    return this.all.map(x => ({ ...omit(x, 'over') }));
  }
}
