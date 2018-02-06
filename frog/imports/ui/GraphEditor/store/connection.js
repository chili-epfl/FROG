// @flow

import cuid from 'cuid';
import { extendObservable, observable, action, computed } from 'mobx';

import { drawPath } from '../utils/path';
import Elem from './elemClass';
import Activity from './activity';
import Operator from './operator';

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

export default class Connection extends Elem {
  constructor(source: ConnectableT, target: ConnectableT, id: ?string) {
    super();

    extendObservable(this, {
      source: source,
      target: target,
      id: id || cuid(),
      klass: 'connection',

      get path(): string {
        return drawPath({
          dragging: false,
          source: this.source.dragPointFrom,
          target: this.target.dragPointTo
        });
      },

      get pathScaled(): string {
        return drawPath({
          dragging: false,
          source: this.source.dragPointFromScaled,
          target: this.target.dragPointToScaled
        });
      },

      get object(): Object {
        return {
          source: { type: getType(this.source), id: this.source.id },
          target: { type: getType(this.target), id: this.target.id },
          _id: this.id
        };
      }
    });
  }
}
