import { observable, computed, action } from "mobx";
import { store } from "./index";
import cuid from "cuid";
import { timeToPx, pxToTime, between } from "../utils";

export default class Activity {
  @action init = (plane: number, startTime: number, title: string, length: number, id: string) => {
    this.id = id || cuid();
    this.over = false; // is mouse over this activity
    this.overdrag = 0;
    this.plane = plane;
    this.title = title || "";
    this.length = length;
    this.startTime = startTime;
  };

  constructor(plane: number, startTime: number, title: string, length: number, id: string) {
    this.init(plane, startTime, title, length, id);
  }

  plane: number;
  id: string;
  @observable over: boolean;
  @observable overdrag: number;
  @observable selected: boolean;
  @observable title: string;
  @observable length: number;
  @observable startTime: number;

  @computed get xScaled(): number {
    return timeToPx(Math.round(this.startTime), store.scale)
  }
  @computed get x(): number {
    return timeToPx(Math.round(this.startTime), 1)
  }
  @computed get widthScaled(): number {
    return timeToPx(Math.round(this.length), store.scale)
  }
  @computed get width(): number {
    return timeToPx(Math.round(this.length), 1)
  }

  @action select = () => {
    store.unselect();
    this.selected = true;
  };

  @action rename = (newname: string) => {
    this.title = newname;
    store.cancelAll();
  };

  @action move = (deltax: number) => {
    if (store.mode !== "moving") {
      return;
    }
    const deltaTime = pxToTime(deltax, store.scale)
    if (store.overlapAllowed) {
      this.startTime = between(0, 120 - this.length, this.startTime + deltaTime);
    } else {
      const oldTime = this.startTime;
      this.startTime = between(
        store.leftbound && store.leftbound.startTime + store.leftbound.length,
        store.rightbound ? store.rightbound.startTime - this.length : 120 - this.length,
        this.startTime + deltaTime
      );
      if (oldTime === this.startTime && Math.abs(deltaTime) !== 0) {
        this.overdrag += deltaTime;
        if (this.overdrag < -3) {
          store.swapActivities(store.leftbound, this);
          store.stopMoving();
        }
        if (this.overdrag > 3) {
          store.swapActivities(this, store.rightbound);
          this.overdrag = 0;
          store.stopMoving();
        }
      }
    }
  };

  @action resize = (deltax: number) => {
    const deltaTime = pxToTime(deltax, store.scale)
    const rightbound = (store.rightbound && store.rightbound.startTime) || 120;
    this.length = between(
      1,
      rightbound - this.startTime,
      this.length + deltaTime
    );
    store.mode = "resizing";
  };

  @action onOver = () => this.over = true;
  @action onLeave = () => this.over = false;
  @action setRename = () => store.renameOpen = this;
  @computed get highlighted(): boolean {
    return this.over &&
      store.draggingFromActivity !== this &&
      store.mode === "dragging";
  }

  @computed get y(): number {
    const offset = store.activityOffsets[this.id];
    return this.plane * 100 + 50 - offset * 30;
  }
}
