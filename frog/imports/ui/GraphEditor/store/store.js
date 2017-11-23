// @flow
import { isEqual, sortBy } from 'lodash';
import { computed, action, observable } from 'mobx';
import Stringify from 'json-stable-stringify';

import valid from '/imports/api/validGraphFn';
import { Graphs, mergeGraph, setCurrentGraph } from '/imports/api/graphs';
import { Activities, Connections, Operators } from '/imports/api/activities';

import ActivityStore from './activityStore';
import OperatorStore, { type OperatorTypes } from './operatorStore';
import ConnectionStore from './connectionStore';
import Operator from './operator';
import Activity from './activity';
import Connection from './connection';
import Session from './session';
import UI from './uiStore';
import { timeToPx } from '../utils';

type ElementTypes = 'operator' | 'activity' | 'connection';

type Elem = Activity | Connection | Operator;
type Coll = Array<any>;
export type BoundsT = {
  leftBoundActivity: ?Activity,
  rightBoundActivity: ?Activity,
  leftBoundTime: number,
  rightBoundTime: number
};

type StateT =
  | { mode: 'resizing', currentActivity: Activity, bounds: BoundsT }
  | {
      mode: 'moving',
      currentActivity: Activity,
      mouseOffset: number,
      initialStartTime: number
    }
  | { mode: 'waitingDrag' }
  | { mode: 'movingOperator', currentOperator: Operator }
  | { mode: 'dragging', draggingFrom: Activity | Operator }
  | { mode: 'placingOperator', operatorType: OperatorTypes }
  | { mode: 'rename', currentActivity: Activity, val: string }
  | { mode: 'normal' }
  | { mode: 'readOnly' };

const getOne = (coll: Coll, crit: Function): ?Elem => {
  const found = coll.filter(crit);
  if (found.size === 0) {
    return undefined;
  }
  return found[0];
};

const getOneId = (coll: Coll, id: string): ?Elem =>
  getOne(coll, x => x.id === id);

export default class Store {
  @observable _state: StateT;
  @observable connectionStore = new ConnectionStore();
  @observable activityStore = new ActivityStore();
  @observable operatorStore = new OperatorStore();
  @observable session = new Session();
  @observable ui = new UI();
  @observable graphId: string = '';
  @observable history = [];
  @observable readOnly: boolean;
  @observable graphErrors: any[] = [];
  @observable valid: any;
  browserHistory: any;
  url: string;

  @observable _graphDuration: number = 120;

  @computed
  get graphDuration(): number {
    return this.ui.isSvg ? this.ui.furthestObject : this._graphDuration;
  }

  set state(newState: StateT) {
    this._state = newState;
  }

  @action
  setBrowserHistory = (history: any, url: string = '/graph') => {
    this.browserHistory = history;
    this.url = url;
  };

  @computed
  get state(): StateT {
    if (this.readOnly) {
      return { mode: 'readOnly' };
    }
    return this._state || { mode: 'normal' };
  }

  findId = ({ type, id }: { type: ElementTypes, id: string }): any => {
    if (type === 'activity') {
      return getOneId(this.activityStore.all, id);
    } else if (type === 'operator') {
      return getOneId(this.operatorStore.all, id);
    }
    return getOneId(this.connectionStore.all, id);
  };

  @action
  changeDuration = (duration: number) => {
    if (duration && duration >= 30 && duration <= 1200) {
      const oldPanTime = this.ui.panTime;
      // changes the scale on duration change
      this._graphDuration = duration;
      this.ui.setScaleValue(this.ui.scale / this.graphDuration);
      const needPanDelta = timeToPx(oldPanTime - this.ui.panTime, 1);
      this.ui.panDelta(needPanDelta);
      Graphs.update(this.graphId, { $set: { duration: this._graphDuration } });
    }
  };

  @observable overlapAllowed = true;
  @action
  toggleOverlapAllowed = () => (this.overlapAllowed = !this.overlapAllowed);

  @action
  deleteSelected = (): void => {
    if (this.state.mode === 'normal') {
      if (this.ui.selected) {
        this.ui.selected.remove();
      }
      this.ui.selected = null;
    }
  };

  @action
  setId = (id: string, readOnly: boolean = false): void => {
    const desiredUrl = `${this.url}/${id}`;
    if (this.browserHistory.location.pathname !== desiredUrl) {
      this.browserHistory.push(desiredUrl);
    }
    setCurrentGraph(id);
    const graph = Graphs.findOne(id);

    this.readOnly = readOnly;
    this.graphId = id;

    this.changeDuration(graph ? graph.duration || 120 : 120);

    this.activityStore.all = Activities.find(
      { graphId: id },
      { reactive: false }
    )
      .fetch()
      .map(
        x =>
          new Activity(x.plane, x.startTime, x.title, x.length, x._id, x.state)
      );

    this.operatorStore.all = Operators.find(
      { graphId: id },
      { reactive: false }
    )
      .fetch()
      .map(x => new Operator(x.time, x.y, x.type, x._id, x.title, x.state));

    this.connectionStore.all = Connections.find(
      { graphId: id },
      { reactive: false }
    )
      .fetch()
      .map(x => {
        const source = this.findId(x.source);
        const target = this.findId(x.target);
        if (
          source instanceof Connection ||
          target instanceof Connection ||
          !source ||
          !target
        ) {
          throw 'Cannot find connection source/target, or source/target is a connection';
        }
        return new Connection(source, target, x._id);
      });

    this.ui.selected = null;
    this.history = [];
    this.addHistory();
    this.state = { mode: 'normal' };
    this.ui.setSidepanelOpen(false);

    const cursors = {
      activities: Activities.find({ graphId: this.graphId }),
      operators: Operators.find({ graphId: this.graphId }),
      connections: Connections.find({ graphId: this.graphId })
    };
    cursors.activities.observe(this.activityStore.mongoObservers);
    cursors.connections.observe(this.connectionStore.mongoObservers);
    cursors.operators.observe(this.operatorStore.mongoObservers);
  };

  @action
  addHistory = () => {
    if (this.readOnly || this.state.mode === 'readOnly') {
      return;
    }
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
    this.refreshValidate();
  };

  validate = () =>
    valid(
      Activities.find({ graphId: this.graphId }).fetch(),
      Operators.find({ graphId: this.graphId }).fetch(),
      Connections.find({ graphId: this.graphId }).fetch()
    );

  @action
  refreshValidate = () => {
    let validData = this.validate();
    if (validData.errors) {
      let change = 0;
      validData.errors.filter(x => x.type === 'needsGroupingKey').forEach(x => {
        if (validData.social && validData.social[x.id]) {
          Activities.update(x.id, {
            $set: {
              groupingKey: validData.social[x.id][0]
            }
          });
          change += 1;
        }
      });
      if (change > 0) {
        validData = this.validate();
      }
    }

    this.graphErrors = sortBy(validData.errors, 'severity');
    this.valid = validData;

    Graphs.update(this.graphId, {
      $set: {
        broken: this.graphErrors.filter(x => x.severity === 'error').length > 0
      }
    });
  };

  @computed
  get canUndo(): boolean {
    return Boolean(this.history.length > 0);
  }

  @action
  undo = () => {
    const [connections, activities, operators] =
      this.history.length > 1 ? this.history.pop() : this.history[0];
    this.activityStore.all = activities.map(
      x => new Activity(x.plane, x.startTime, x.title, x.length, x.id)
    );
    this.operatorStore.all = operators.map(
      x => new Operator(x.time, x.y, x.type, x.id, x.title)
    );
    this.connectionStore.all = connections.map(x => {
      const source = this.findId(x.source);
      const target = this.findId(x.target);
      if (
        source instanceof Connection ||
        target instanceof Connection ||
        !source ||
        !target
      ) {
        throw 'Cannot find connection source/target, or source/target is a connection';
      }
      return new Connection(source, target, x._id);
    });

    mergeGraph(this.objects);
  };

  @action
  setSession = (session: any) => {
    if (this.session.id !== session._id) {
      this.session.close();
      this.session = new Session(session);
    }
  };

  @computed
  get objects(): any {
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
      graphDuration: this._graphDuration
    };
  }
}
