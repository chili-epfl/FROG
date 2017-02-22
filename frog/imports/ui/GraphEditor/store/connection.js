// @flow
import cuid from 'cuid';
import { observable, action, computed } from 'mobx';
import { drawPath } from '../utils/path';
import { store } from './index';
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

export default class Connection {
  id: string;
  @observable source: ConnectableT;
  @observable target: ConnectableT;
  @observable selected: boolean;

  @action select = (): void => {
    store.ui.unselect();
    this.selected = true;
  };

  @action init = (source: ConnectableT, target: ConnectableT, id: ?string) => {
    this.source = source;
    this.target = target;
    this.id = id || cuid();
  };

  constructor(source: ConnectableT, target: ConnectableT, id: ?string) {
    this.init(source, target, id);
  }

  @computed get path(): string {
    return drawPath(...this.source.dragPointFrom, ...this.target.dragPointTo);
  }

  @computed get pathScaled(): string {
    return drawPath(
      ...this.source.dragPointFromScaled,
      ...this.target.dragPointToScaled
    );
  }

  @computed get object(): Object {
    return {
      source: { type: getType(this.source), id: this.source.id },
      target: { type: getType(this.target), id: this.target.id },
      _id: this.id
    };
  }
}
