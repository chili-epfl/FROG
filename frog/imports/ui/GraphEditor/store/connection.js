// @flow

import cuid from 'cuid';
import { extendObservable } from 'mobx';

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
  pathScaled: string;
  path: string;
  source: ConnectableT;
  target: ConnectableT;

  constructor(source: ConnectableT, target: ConnectableT, id: ?string) {
    super();

    extendObservable(this, {
      source,
      target,
      id: id || cuid(),
      klass: 'connection',

      get path(): ?string {
        if (this.source?.dragPointFrom && this.target?.dragPointTo) {
          return drawPath({
            dragging: false,
            source: this.source.dragPointFrom,
            target: this.target.dragPointTo
          });
        } else {
          return undefined;
        }
      },

      get pathScaled(): ?string {
        if (
          this.source?.dragPointFromScaled &&
          this.target?.dragPointToScaled
        ) {
          return drawPath({
            dragging: false,
            source: this.source.dragPointFromScaled,
            target: this.target.dragPointToScaled
          });
        } else {
          return undefined;
        }
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
