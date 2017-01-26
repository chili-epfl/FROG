import cuid from "cuid";
import { drawPath } from "../path";
import { observable, action, computed } from "mobx";
import { store } from "./index";
import { pxToTime, timeToPx } from '../utils'

export default class Operator {
  @observable y
  @observable over
  @observable time
  @action init(time, y, type, id) {
    this.time = time 
    this.y = y
    this.id = id || cuid()
    this.type = type
  }

  constructor(...args) {
    this.init(...args);
  }

  @computed get x() {
    return timeToPx(this.time, 1)
  }

  @computed get xScaled() {
    return timeToPx(this.time, store.scale)
  }

  @computed get coordsScaled() {
    return [this.xScaled, this.y]
  }

  @computed get coords() {
    return [this.x, this.y]
  }

  @action onClick = () => {
    store.unselect();
    this.selected = true;
  };

  @action onOver = () => this.over = true;
  @action onLeave = () => this.over = false;
  @computed get highlighted(): boolean {
    return this.over &&
      store.draggingFromActivity !== this &&
      store.mode === "dragging";
  }

  @action startDragging = (e) => {
    if(!e.shiftKey) { 
      store.startDragging(this)
    }
  }

  @action onDrag = (e, { deltaX, deltaY }) => {
    if(!e.shiftKey) { 
      store.dragging(deltaX, deltaY)
    } else {
      this.time += pxToTime(deltaX, store.scale)
      this.y += deltaY
    }
  }

  @action stopDragging = (e) => {
    if(!e.shiftKey) {
      store.stopDragging()
    }
  }
}
