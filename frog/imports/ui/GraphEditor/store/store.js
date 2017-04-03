import { isEqual } from 'lodash';
import { computed, action, observable } from 'mobx';
import Stringify from 'json-stable-stringify';

import ActivityStore from './activityStore';
import OperatorStore, { OperatorTypes } from './operatorStore';
import ConnectionStore from './connectionStore';
import Operator from './operator';
import { Graphs, mergeGraph, setCurrentGraph } from '../../../api/graphs';
import Activity from './activity';
import Connection from './connection';
import UI from './uiStore';
import { Activities, Connections, Operators } from '../../../api/activities';
import { timeToPx } from '../utils';

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
  @observable _state: StateT;
  @observable connectionStore = new ConnectionStore();
  @observable activityStore = new ActivityStore();
  @observable operatorStore = new OperatorStore();
  @observable ui = new UI();
  @observable graphId: string = '';
  @observable history = [];
  @observable readOnly: Boolean;

  @observable _graphDuration: number = 120;
  @observable graphDuration: number = 120;

  set state(newState: StateT) {
    this._state = newState;
  }

  @computed get state(): StateT {
    if (this.readOnly) {
      return { mode: 'readOnly' };
    }
    return this._state || { mode: 'normal' };
  }

  findId = ({ type, id }: { type: ElementTypes, id: string }): Elem => {
    if (type === 'activity') {
      return getOneId(this.activityStore.all, id);
    } else if (type === 'operator') {
      return getOneId(this.operatorStore.all, id);
    }
    return getOneId(this.connectionStore.all, id);
  };

  @action changeDuration = duration => {
    this._graphDuration = duration;
    if (duration && duration >= 30 && duration <= 1200) {
      const oldPanTime = this.ui.panTime;
      // changes the scale on duration change
      this.ui.setScaleValue(this.ui.scale / this.graphDuration * duration);
      this.graphDuration = duration;
      const needPanDelta = timeToPx(oldPanTime - this.ui.panTime, 1);
      this.ui.panDelta(needPanDelta);
    }
  };

  @observable overlapAllowed = true;
  @action updateSettings = (settings: { overlapAllowed: boolean }) =>
    this.overlapAllowed = settings.overlapAllowed;

  @action deleteSelected = (): void => {
    if (this.state.mode === 'normal') {
      if (this.ui.selected) {
        this.ui.selected.remove();
      }
      this.ui.setStickySelected(null);
      this.ui.selected = null;
    }
  };

  @action setId = (id: string, readOnly?: Boolean = false): void => {
    setCurrentGraph(id);
    const graph = Graphs.findOne(id);

    this.readOnly = readOnly;
    this.graphId = id;

    this.changeDuration(graph ? graph.duration || 120 : 120);
    this.ui.setStickySelected(null);

    this.activityStore.all = Activities.find(
      { graphId: id },
      { reactive: false }
    )
      .fetch()
      .map(x => new Activity(x.plane, x.startTime, x.title, x.length, x._id));

    this.operatorStore.all = Operators.find(
      { graphId: id },
      { reactive: false }
    )
      .fetch()
      .map(x => new Operator(x.time, x.y, x.type, x._id, x.title));

    this.connectionStore.all = Connections.find(
      { graphId: id },
      { reactive: false }
    )
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
      activities: Activities.find({ graphId: this.graphId }),
      operators: Operators.find({ graphId: this.graphId }),
      connections: Connections.find({ graphId: this.graphId })
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
      x => new Operator(x.time, x.y, x.type, x.id, x.title)
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
        graphId: this.graphId
      })),
      operators: this.operatorStore.all.map(x => ({
        ...x.object,
        graphId: this.graphId
      })),
      connections: this.connectionStore.all.map(x => ({
        ...x.object,
        graphId: this.graphId
      })),
      graphId: this.graphId,
      graphDuration: this.graphDuration
    };
  }
}
