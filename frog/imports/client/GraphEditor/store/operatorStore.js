// @flow

import { extendObservable, action } from 'mobx';
import { maxBy } from 'lodash';

import { store } from './index';
import Operator from './operator';
import Connection from './connection';
import Activity from './activity';

export type OperatorTypes = 'product' | 'social' | 'control';

export default class OperatorStore {
  all: Operator[];

  mongoAdd: any => void;

  mongoChange: (newx: Operator, oldx: { _id: string }) => void;

  mongoRemove: ({ _id: string }) => void;

  place: OperatorTypes => void;

  addOperator: () => void;

  history: Array<any>;

  furthestOperator: number;

  constructor() {
    extendObservable(this, {
      all: [],

      mongoAdd: action((x: any) => {
        if (!store.findId({ type: 'operator', id: x._id })) {
          this.all.push(
            new Operator(
              x.time,
              x.y,
              x.type,
              x.data,
              x.operatorType,
              x._id,
              x.title,
              x.state
            )
          );
          store.refreshValidate();
        }
      }),

      mongoChange: action((newx: Operator, oldx: { _id: string }) => {
        store.findId({ type: 'operator', id: oldx._id }).update(newx);
        store.refreshValidate();
      }),

      mongoRemove: action((remx: { _id: string }) => {
        this.all = this.all.filter(x => x.id !== remx._id);
        store.refreshValidate();
      }),

      place: action((type: OperatorTypes) => {
        const { selected } = store.ui;
        if (selected && selected instanceof Connection) {
          const source = selected.source;
          const target = selected.target;
          const y = (source.dragPointFrom.Y + target.dragPointTo.Y) / 2;
          const sourceTime =
            source instanceof Activity
              ? source.startTime + source.length
              : source.time;
          const targetTime =
            target instanceof Activity ? target.startTime : target.time;
          const time = (sourceTime + targetTime) / 2;
          const newOp = new Operator(time, y, type);
          this.all.push(newOp);
          selected.remove(false);
          store.connectionStore.all.push(
            new Connection(
              { type: source.klass, id: source.id },
              { type: 'operator', id: newOp.id }
            )
          );
          store.connectionStore.all.push(
            new Connection(
              { type: 'operator', id: newOp.id },
              { type: target.klass, id: target.id }
            )
          );
        } else if (store.state.mode === 'normal') {
          store.state = { mode: 'placingOperator', operatorType: type };
        }
      }),

      addOperator: action(() => {
        if (store.state.mode === 'placingOperator') {
          this.all.push(
            new Operator(
              store.ui.socialCoordsTime[0],
              store.ui.socialCoordsTime[1] - 95,
              store.state.operatorType
            )
          );
          store.state = { mode: 'normal' };
          store.addHistory();
        }
      }),

      get history(): Array<any> {
        return this.all.map(x => ({
          time: x.time,
          y: x.y,
          type: x.type,
          id: x.id,
          title: x.id,
          data: x.data,
          operatorType: x.operatorType
        }));
      },

      get furthestOperator(): number {
        const op = maxBy(this.all, x => x.time);
        return op && op.time + 1;
      }
    });
  }
}
