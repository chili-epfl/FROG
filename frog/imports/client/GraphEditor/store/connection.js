// @flow

import cuid from 'cuid';
import { extendObservable } from 'mobx';

import { drawPath } from '../utils/path';
import Elem from './elemClass';
import Activity from './activity';
import Operator from './operator';
import { store } from './index';

const getType = item => {
  if (item instanceof Activity) {
    return 'activity';
  } else if (item instanceof Operator) {
    return 'operator';
  } else if (item instanceof Connection) {
    return 'connection';
  }
  throw 'Wrong object type in Connection';
};

type ConnectableT = Activity | Operator;
type ConnectableObj = {
  type: 'activity' | 'operator' | 'connection',
  id: string
};

export default class Connection extends Elem {
  pathScaled: string;
  path: string;
  sourceObj: ConnectableObj;
  targetObj: ConnectableObj;
  source: ConnectableT;
  target: ConnectableT;

  constructor(
    sourceObj: ConnectableObj,
    targetObj: ConnectableObj,
    id: ?string
  ) {
    super();
    extendObservable(this, {
      sourceObj,
      targetObj,
      id: id || cuid(),
      klass: 'connection',

      get source(): ?ConnectableT {
        if (this.sourceObj.type === 'activity') {
          return store.activityStore.all.find(x => x.id === this.sourceObj.id);
        }
        if (this.sourceObj.type === 'operator') {
          return store.operatorStore.all.find(x => x.id === this.sourceObj.id);
        }
        return undefined;
      },
      get target(): ?ConnectableT {
        if (this.targetObj.type === 'activity') {
          return store.activityStore.all.find(x => x.id === this.targetObj.id);
        }
        if (this.targetObj.type === 'operator') {
          return store.operatorStore.all.find(x => x.id === this.targetObj.id);
        }
        return undefined;
      },
      get path(): string {
        return (
          this.source &&
          this.target &&
          drawPath({
            dragging: false,
            source: this.source?.dragPointFrom,
            target: this.target?.dragPointTo
          })
        );
      },

      get pathScaled(): string {
        return (
          this.source &&
          this.target &&
          drawPath({
            dragging: false,
            source: this.source.dragPointFromScaled,
            target: this.target.dragPointToScaled
          })
        );
      },

      get object(): ?Object {
        if (this.source?.id && this.target?.id) {
          return {
            source: { type: getType(this.source), id: this.source.id },
            target: { type: getType(this.target), id: this.target.id },
            _id: this.id
          };
        } else {
          return undefined;
        }
      }
    });
  }
}
