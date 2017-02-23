// @flow
import { computed, action, observable } from 'mobx';

import ActivityStore from './activityStore';
import OperatorStore, { OperatorTypes } from './operatorStore';
import ConnectionStore from './connectionStore';
import Operator from './operator';
import { mergeGraph, setCurrentGraph } from '../../../api/graphs';
import Activity from './activity';
import Connection from './connection';
import UI from './uiStore';

import { Activities, Connections, Operators } from '../../../api/activities';

type ElementTypes = 'operator' | 'activity' | 'connection';

export type Elem = Activity | Connection | Operator;
export type Coll = Array<Elem>;
export type BoundsT = {
  leftBoundActivity: ?Activity,
  rightBoundActivity: ?Activity,
  leftBoundTime: number,
  rightBoundTime: number
};

type StateT =
  | { mode: 'resizing', currentActivity: typeof Activity, bounds: BoundsT }
  | {
      mode: 'moving',
      currentActivity: typeof Activity,
      bounds: BoundsT
    }
  | { mode: 'movingOperator', currentOperator: typeof Operator }
  | { mode: 'dragging', draggingFrom: typeof Activity | typeof Operator }
  | { mode: 'placingOperator', operatorType: OperatorTypes }
  | { mode: 'rename', currentActivity: typeof Activity }
  | { mode: 'normal' };

const getid = (arys: Array<Coll>, id: string): ?Elem => {
  const joinedArys = arys.reduce((acc, x) => acc.concat(...x), []);
  const res = joinedArys.filter(x => x.id === id);
  return res && res[0];
};

const getOne = (coll: Coll, crit: Function): ?Elem => {
  const found = coll.filter(crit);
  if (found.size === 0) {
    return undefined;
  }
  return found[0];
};

const getOneId = (coll: Coll, id: string): Elem =>
  getOne(coll, x => x.id === id);

export default class Store {
  @observable id: string = '';
  @observable ui = new UI();
  @observable connectionStore = new ConnectionStore();
  @observable state: StateT = { mode: 'normal' };
  @observable activityStore = new ActivityStore();
  @observable operatorStore = new OperatorStore();
  @action addHistory() {}

  findId = ({ type, id }: { type: ElementTypes, id: string }) => {
    if (type === 'activity') {
      return getOneId(this.activityStore.all, id);
    } else if (type === 'operator') {
      return getOneId(this.operatorStore.all, id);
    }
    return getOneId(this.connectionStore.all, id);
  };

  @action deleteSelected = () => {
    this.ui.selected && this.ui.selected.remove();
    this.ui.selected = null;
  };

  @action setId = (id: string) => {
    setCurrentGraph(id);
    this.id = id;
    this.activityStore.all = Activities
      .find({ graphId: id }, { reactive: false })
      .fetch()
      .map(x => new Activity(x.plane, x.startTime, x.title, x.length, x._id));
    this.operatorStore.all = Operators
      .find({ graphId: id }, { reactive: false })
      .fetch()
      .map(x => new Operator(x.time, x.y, x.type, x._id));
    this.connectionStore.all = Connections
      .find({ graphId: id }, { reactive: false })
      .fetch()
      .map(x => {
        const source = this.findId(x.source);
        const target = this.findId(x.target);
        return new Connection(source, target, x._id);
      });
    const cursors = {
      activities: Activities.find({ graphId: this.id }),
      operators: Operators.find({ graphId: this.id }),
      connections: Connections.find({ graphId: this.id })
    };
    cursors.activities.observe(this.activityStore.mongoObservers);
    cursors.connections.observe(this.connectionStore.mongoObservers);
    cursors.operators.observe(this.operatorStore.mongoObservers);
  };

  @observable history = [];

  @action addHistory = () => {
    this.history.push([
      this.connectionStore.history,
      this.activityStore.history,
      this.operatorStore.history
    ]);
    mergeGraph(this.objects);
  };

  @computed get canUndo(): boolean {
    return Boolean(this.history.length > 0);
  }

  @action undo = () => {
    const [connections, activities, operators] = this.history.length > 1
      ? this.history.pop()
      : this.history[0];
    this.activityStore.all = activities.map(
      x => new Activity(x.plane, x.startTime, x.title, x.length, x.id)
    );
    this.operatorStore.all = operators.map(
      x => new Operator(x.time, x.y, x.type, x.id)
    );
    this.connectionStore.all = connections.map(x => {
      const source = this.findId(x.source);
      const target = this.findId(x.target);
      return new Connection(source, target, x._id);
    });

    mergeGraph(this.objects);
  };
  @computed get objects(): any {
    return {
      activities: this.activityStore.all.map(x => ({
        ...x.object,
        graphId: this.id
      })),
      operators: this.operatorStore.all.map(x => ({
        ...x.object,
        graphId: this.id
      })),
      connections: this.connectionStore.all.map(x => ({
        ...x.object,
        graphId: this.id
      })),
      graphId: this.id
    };
  }
}

// @observable GraphID: string;
// @observable overlapAllowed = false;
// @action updateSettings = (settings: { overlapAllowed: boolean }) =>
//   this.overlapAllowed = settings.overlapAllowed;
// @observable currentlyOver: boolean;
// //* ***************************************
// //* ***************************************
// @observable mode: ModeT = { mode: 'normal' };
// @computed get hasSelection() {
//   const sel = this
//     .connections.concat(this.activities.concat(this.operators))
//     .filter(x => x.selected);
//   if (sel.length === 0) {
//     return false;
//   }
//   const selection = sel[0];
//   if (selection instanceof Activity) {
//     return ['activity', selection];
//   } else if (selection instanceof Operator) {
//     return ['operator', selection];
//   }
//   return ['connection', selection];
// }
// @action canvasClick = (e: { clientX: number, clientY: number }) => {
//   if (this.mode === 'placingOperator') {
//     const coords = this.rawMouseToTime(
//       e.nativeEvent.offsetX,
//       e.nativeEvent.offsetY
//     );
//     this.operators.push(new Operator(
//       coords[0],
//       coords[1],
//       this.operatorType
//     ));
//     this.mode = { mode: 'normal' };
//     this.addHistory();
//   }
//   this.renameOpen = null;
// };
// @action unselect = () => {
//   this.selected = undefined;
// };
// }
