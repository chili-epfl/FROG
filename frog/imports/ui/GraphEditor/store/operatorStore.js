import { extendObservable, action } from 'mobx';
import { omit, maxBy } from 'lodash';

import { store } from './index';
import Operator from './operator';

export type OperatorTypes = 'product' | 'social' | 'control';

export default class OperatorStore {
  constructor() {
    extendObservable(this, {
      all: [],

      mongoAdd: action((x: any) => {
        if (!store.findId({ type: 'operator', id: x._id })) {
          this.all.push(
            new Operator(x.time, x.y, x.type, x._id, x.title, x.state)
          );
        }
      }),

      mongoChange: action((newx: Operator, oldx: { _id: string }) => {
        store.findId({ type: 'operator', id: oldx._id }).update(newx);
      }),

      mongoRemove: action((remx: { _id: string }) => {
        this.all = this.all.filter(x => x.id !== remx._id);
      }),

      place: action((type: OperatorTypes) => {
        if (store.state.mode === 'normal') {
          store.state = { mode: 'placingOperator', operatorType: type };
        }
      }),

      get mongoObservers(): {
        added: Function,
        changed: Function,
        removed: Function
      } {
        return {
          added: this.mongoAdd,
          changed: this.mongoChange,
          removed: this.mongoRemove
        };
      },

      get history(): Array<any> {
        return this.all.map(x => ({ ...omit(x, 'over') }));
      },

      get furthestOperator(): number {
        const op = maxBy(this.all, x => x.time);
        return op && op.time + 1;
      }
    });
  }
}
