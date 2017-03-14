import { computed, action, observable } from 'mobx';
import { isEqual } from 'lodash';
import Stringify from 'json-stable-stringify';

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
      mouseOffset: number
    }
  | { mode: 'waitingDrag' }
  | { mode: 'movingOperator', currentOperator: typeof Operator }
  | { mode: 'dragging', draggingFrom: typeof Activity | typeof Operator }
  | { mode: 'placingOperator', operatorType: OperatorTypes }
  | { mode: 'rename', currentActivity: typeof Activity, val: string }
  | { mode: 'normal' };

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
  @observable state: StateT = { mode: 'normal' };
  @observable connectionStore = new ConnectionStore();
  @observable activityStore = new ActivityStore();
  @observable operatorStore = new OperatorStore();
  @observable ui = new UI();
  @observable graphID: string = '';
  @observable history = [];

  findId = ({ type, id }: { type: ElementTypes, id: string }): Elem => {
    if (type === 'activity') {
      return getOneId(this.activityStore.all, id);
    } else if (type === 'operator') {
      return getOneId(this.operatorStore.all, id);
    }
    return getOneId(this.connectionStore.all, id);
  };

  @action renameChange = (val: string) => this.state = { ...this.state, val };
  @observable overlapAllowed = false;
  @action updateSettings = (settings: { overlapAllowed: boolean }) =>
    this.overlapAllowed = settings.overlapAllowed;

  @action deleteSelected = (): void => {
    if (this.state.mode === 'normal') {
      if (this.ui.selected) {
        this.ui.selected.remove();
      }
      this.ui.selected = null;
    }
  };

  @action setId = (id: string): void => {
    setCurrentGraph(id);
    this.graphID = id;
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

    this.history = [];
    this.addHistory();
    this.state = { mode: 'normal' };

    const cursors = {
      activities: Activities.find({ graphId: this.graphID }),
      operators: Operators.find({ graphId: this.graphID }),
      connections: Connections.find({ graphId: this.graphID })
    };
    cursors.activities.observe(this.activityStore.mongoObservers);
    cursors.connections.observe(this.connectionStore.mongoObservers);
    cursors.operators.observe(this.operatorStore.mongoObservers);
  };

  @action addHistory = () => {
    const newEntry = [
      this.connectionStore.history,
      this.activityStore.history,
      this.operatorStore.history
    ];
    const lastEntry = this.history.slice(-1).pop() || [];
    if (!isEqual(Stringify(lastEntry), Stringify(newEntry))) {
      this.history.push(newEntry);
      mergeGraph(this.objects);
    }
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
        graphId: this.graphID
      })),
      operators: this.operatorStore.all.map(x => ({
        ...x.object,
        graphId: this.graphID
      })),
      connections: this.connectionStore.all.map(x => ({
        ...x.object,
        graphId: this.graphID
      })),
      graphId: this.graphID
    };
  }
}
