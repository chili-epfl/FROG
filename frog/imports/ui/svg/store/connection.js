import cuid from "cuid";
import { drawPath } from "../path";
import { observable, action, computed } from "mobx";
import { store } from "./index";

export default class Connection {
  @observable source;
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
    const x = this.source.xScaled
    const width = this.source.widthScaled || 0
    const x2 = this.target.xScaled
    return drawPath(x + width, this.source.y + 15, x2, this.target.y + 15);
  }
}
