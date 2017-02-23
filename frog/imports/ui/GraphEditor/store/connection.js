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

export default class Connection {
  @observable source;
  id: string;
  @observable target;
  @observable selected;
  @action select = () => {
    store.unselect();
    this.selected = true;
  };

  @action init = (source, target, id) => {
    this.source = source;
    this.target = target;
    this.id = id || cuid();
  };

  constructor(...args) {
    this.init(...args);
  }

  @computed get path() {
    return drawPath(
      this.source.x + (this.source.width || 0),
      this.source.y,
      this.target.x,
      this.target.y
    );
  }
  @computed get pathScaled() {
    return drawPath(...this.source.dragPoint, ...this.target.dragPoint);
  }

  @computed get object() {
    return {
      source: { type: getType(this.source), id: this.source.id },
      target: { type: getType(this.target), id: this.target.id },
      _id: this.id
    };
  }
}
