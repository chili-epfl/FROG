// @flow

import { extendObservable, action } from 'mobx';
import { inject, observer } from 'mobx-react';

class LIStore {
  dragState: ?{ item: string | Object, shiftKey: boolean };
  setDraggedItem: (item: string | Object, s: boolean) => void;
  overCB: ?Function;
  setOverCB: (?Function) => void;
  stopDragging: () => void;

  constructor() {
    extendObservable(this, {
      dragState: null,
      setDraggedItem: action(
        (item, shiftKey) => (this.dragState = { item, shiftKey })
      ),
      setOverCB: action(cb => (this.overCB = cb)),
      stopDragging: action(() => {
        if (this.overCB && this.dragState) {
          this.overCB(this.dragState);
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
