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

type Elem = Activity | Connection | Operator;
type Coll = Array<Elem>;

type StateT =
  | { mode: 'resizing', currentActivity: Activity, rightBound: Activity }
  | {
    mode: 'moving',
    currentactivity: Activity,
    leftbound: Activity,
    rightbound: Activity
  }
  | { mode: 'dragging', draggingfrom: Activity | Operator }
  | { mode: 'placingOperator', operatorType: OperatorTypes }
  | { mode: 'rename', currentActivity: Activity }
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

const getOneId = (coll, id) => getOne(coll, x => x.id === id);

export default class Store {
  @observable ui = new UI();
  @observable connectionStore = new ConnectionStore();
  @observable state: StateT;
}
// findId = ({ type, id }: { type: ElementTypes, id: string }) => {
//   if (type === 'activity') {
//     return getOneId(this.activities, id);
//   } else if (type === 'operator') {
//     return getOneId(this.operators, id);
//   }
//   return getOneId(this.connections, id);
// };
// @observable GraphID: string;
// @observable connectionStore = new ConnectionStore();
// @observable activityStore = new ActivityStore();
// @observable operatorStore = new OperatorStore();
// @observable history = [];
// @observable selected: Elem;
// @action addHistory = () => {
//   this.history.push([
//     this.connectionStore.history,
//     this.activityStore.history,
//     this.operatorStore.history
//   ]);
//   mergeGraph(this.objects);
// };
// @computed get canUndo(): boolean {
//   return Boolean(this.history.length > 0);
// }
// @action undo = () => {
//   const [connections, activities, operators] = this.history.length > 1
//     ? this.history.pop()
//     : this.history[0];
//   this.activities = activities.map(
//     x => new Activity(x.plane, x.startTime, x.title, x.length, x.id)
//   );
//   this.operators = operators.map(
//     x => new Operator(x.time, x.y, x.type, x.id)
//   );
//   this.connections = connections.map(
//     x =>
//       new Connection(
//         getid([this.operators, this.activities], x.source.id),
//         getid([this.operators, this.activities], x.target.id)
//       )
//   );
//   mergeGraph(this.objects);
// };
// @observable overlapAllowed = false;
// @action updateSettings = (settings: { overlapAllowed: boolean }) =>
//   this.overlapAllowed = settings.overlapAllowed;
// @observable currentlyOver: boolean;
// //* ***************************************
// @action setId = (id: string) => {
//   setCurrentGraph(id);
//   this.id = id;
//   this.activities = Activities.find({ graphId: id }, { reactive: false })
//     .fetch()
//     .map(x => new Activity(x.plane, x.startTime, x.title, x.length, x._id));
//   this.operators = Operators.find({ graphId: id }, { reactive: false })
//     .fetch()
//     .map(x => new Operator(x.time, x.y, x.type, x._id));
//   this.connections = Connections.find({ graphId: id }, { reactive: false })
//     .fetch()
//     .map(x => {
//       const source = this.findId(x.source);
//       const target = this.findId(x.target);
//       return new Connection(source, target, x._id);
//     });
//   const cursors = {
//     activities: Activities.find({ graphId: this.id }),
//     operators: Operators.find({ graphId: this.id }),
//     connections: Connections.find({ graphId: this.id })
//   };
//   cursors.activities.observe(this.activityStore.mongoObservers);
//   cursors.connections.observe(this.connectionStore.mongoObservers);
//   cursors.operators.observe(this.operatorStore.mongoObservers);
// };
// //* ***************************************
// @observable mode: ModeT = { mode: 'normal' };
// @action deleteSelected = () => {
//   const conn = this.connections.length;
//   const act = this.activities.length;
//   const opt = this.operators.length;
//   const delActivity = this.activities.filter(x => x.selected);
//   if (delActivity.length > 0) {
//     const delAct = this.activities.filter(x => x.selected)[0];
//     this.connections = this.connections.filter(
//       x => x.target.id !== delAct.id && x.source.id !== delAct.id
//     );
//   } else {
//     const delOperator = this.operators.filter(x => x.selected);
//     if (delOperator.length > 0) {
//       const delOpt = this.operators.filter(x => x.selected)[0];
//       this.connections = this.connections.filter(
//         x => x.target.id !== delOpt.id && x.source.id !== delOpt.id
//       );
//     }
//   }
//   this.connections = this.connections.filter(x => !x.selected);
//   this.activities = this.activities.filter(x => !x.selected);
//   this.operators = this.operators.filter(x => !x.selected);
//   if (
//     conn !== this.connections.length ||
//       act !== this.activities.length ||
//       opt !== this.operators.length
//   ) {
//     this.addHistory();
//   }
// };
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
// @action cancelAll = () => {
//   this.selected = undefined;
//   this.mode = { mode: 'normal' };
// };
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
// @computed get objects(): any {
//   return {
//     activities: this.activities.map(x => ({ ...x.object, graphId: this.id })),
//     operators: this.operators.map(x => ({ ...x.object, graphId: this.id })),
//     connections: this.connections.map(x => ({
//       ...x.object,
//       graphId: this.id
//     })),
//     graphId: this.id
//   };
// }
// }
