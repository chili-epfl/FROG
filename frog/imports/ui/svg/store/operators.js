// @flow
import { computed, action, observable } from 'mobx';
import { store } from './store'
import Operator from './operator'

export default class OperatorStore {
  @action mongoAdd= (x: any) => {
    if (!this.findId({ type: 'operator', id: x._id })) {
      this.operators.push(new Operator(x.time, x.y, x.type, x._id));
    }
  };
  @action mongoChange= (newx, oldx) => {
    this.findId({ type: 'operator', id: oldx._id }).update(newx);
  };

  @action mongoRemove= remx => {
    this.operators = this.operators.filter(x => x.id !== remx._id);
  };

  @computed get mongoObservers() {
    return ({
      added: this.mongoAdd,
      changed: this.mongoChange,
      removed: this.mongoRemove
    })
  }

  @computed get history(): Array<any> {
    return this.all.map(x => ({...x}))
  }
}
