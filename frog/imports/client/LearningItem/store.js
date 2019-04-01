// @flow
import { extendObservable, action, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

class LIStore {
  dragState: ?{ item: string | Object, shiftKey: boolean };

  setDraggedItem: (item: string | Object, s: boolean) => void;

  overCB: ?Function;

  setOverCB: (?Function) => void;

  stopDragging: () => void;

  coords: ?[number, number];

  setXY: (x: number, y: number) => void;

  constructor() {
    extendObservable(this, {
      dragState: null,
      openCreator: null,
      coords: null,
      setDraggedItem: action(
        (item, shiftKey) => (this.dragState = { item, shiftKey })
      ),
      setOverCB: action(cb => (this.overCB = cb)),
      setXY: action((x, y) => {
        this.coords = [x, y];
      }),
      stopDragging: action(() => {
        const overCB = this.overCB;
        if (overCB && this.dragState) {
          overCB(toJS(this.dragState));
        }
        this.dragState = null;
      })
    });
  }
}
export const listore = new LIStore();
export function connect(component: any): any {
  return inject('store')(observer(component));
}
