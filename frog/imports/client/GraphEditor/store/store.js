// @flow

import { isEmpty, isEqual, sortBy } from 'lodash';
import { extendObservable, action } from 'mobx';
import Stringify from 'json-stable-stringify';
import * as Sentry from '@sentry/browser';

import valid from '/imports/api/validGraphFn';
import {
  Graphs,
  mergeGraph,
  setCurrentGraph,
  findOneGraphMongo
} from '/imports/api/graphs';
import {
  Activities,
  findActivitiesMongo,
  Connections
} from '/imports/api/activities';
import { Operators, findOperatorsMongo } from '/imports/api/operators';
import { LibraryStates } from '/imports/api/cache';
import { loadGraphMetaData } from '/imports/api/remoteGraphs';
import { LocalSettings } from '/imports/api/settings';

import ActivityStore from './activityStore';
import OperatorStore, { type OperatorTypes } from './operatorStore';
import ConnectionStore from './connectionStore';
import Operator from './operator';
import Activity from './activity';
import Connection from './connection';
import Session from './session';
import UI from './uiStore';
import { timeToPx } from '../utils';
import { store } from './index';

export type ElementTypes = 'operator' | 'activity' | 'connection';
type Elem = Activity | Connection | Operator;
type Coll = Array<any>;

export type BoundsT = {
  leftBoundActivity: ?Activity,
  rightBoundActivity: ?Activity,
  leftBoundTime: number,
  rightBoundTime: number
};

export type StateT =
  | {
      mode: 'resizing',
      currentActivity: Activity,
      bounds: BoundsT
    }
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
  if (found.length === 0) {
    return undefined;
  }
  return found[0];
};

const getOneId = (coll: Coll, id: string): ?Elem =>
  getOne(coll, x => x.id === id);

export default class Store {
  browserHistory: any;

  url: string;

  history: any[];

  objects: {
    connections: Elem[],
    activities: Elem[],
    operators: Elem[],
    graphId: string,
    graphDuration: number
  };

  state: StateT;

  connectionStore: ConnectionStore;

  activityStore: ActivityStore;

  operatorStore: OperatorStore;

  ui: UI;

  overlapAllowed: boolean;

  graphId: string;

  templateSource: string;

  _graphDuration: number;

  graphDuration: number;

  readOnly: boolean;

  changeDuration: (number, ?boolean) => void;

  addHistory: () => void;

  refreshValidate: () => void;

  session: Session;

  graphErrors: Object[];

  valid: Object;

  setId: (string, ?boolean) => void;

  setBrowserHistory: (?Object, ?string) => void;

  setSession: any => void;

  deleteSelected: (?boolean) => void;

  constructor() {
    extendObservable(this, {
      _state: null,
      connectionStore: new ConnectionStore(),
      activityStore: new ActivityStore(),
      operatorStore: new OperatorStore(),
      session: new Session(),
      ui: new UI(),
      graphId: '',
      templateSource: null,
      graphErrors: [],
      valid: undefined,
      _graphDuration: 60,
      readOnly: false,

      get graphDuration(): number {
        return this.ui.isSvg ? this.ui.furthestObject : this._graphDuration;
      },

      get state(): StateT {
        if (this.readOnly) {
          return { mode: 'readOnly' };
        }
        return this._state || { mode: 'normal' };
      },

      set state(newState: StateT) {
        this._state = newState;
      },

      setBrowserHistory: action(
        (history: any, url: string = '/teacher/graph') => {
          this.browserHistory = history;
          this.url = url;
        }
      ),

      changeDuration: action((duration: number, dbIsCorrect?: boolean) => {
        if (duration && duration >= 30 && duration <= 1200) {
          const oldPanTime = this.ui.panTime;
          // changes the scale on duration change
          this.ui.setScaleValue(
            (this.ui.scale * duration) / this._graphDuration
          );
          this._graphDuration = duration;
          const needPanDelta = timeToPx(oldPanTime - this.ui.panTime, 1);
          this.ui.panDelta(needPanDelta);
          if (!dbIsCorrect) {
            Graphs.update(this.graphId, {
              $set: { duration: this._graphDuration }
            });
          }
        }
      }),

      overlapAllowed: true,

      toggleOverlapAllowed: action(() => {
        this.overlapAllowed = !this.overlapAllowed;
      }),

      deleteSelected: action(shift => {
        if (this.state.mode === 'normal') {
          if (this.ui.selected) {
            this.ui.selected.remove(shift);
          }
          this.ui.selected = null;
        }
      }),
      // should check for new global version of graph
      setId: action((id: string, readOnly: boolean = false) => {
        Sentry.addBreadcrumb({
          category: 'graph',
          message: 'SetId ' + id
        });
        const desiredUrl = `${this.url}/${id}`;
        if (
          this.browserHistory &&
          this.browserHistory.location.pathname !== desiredUrl
        ) {
          this.browserHistory.push(desiredUrl + LocalSettings.UrlCoda);
        }
        setCurrentGraph(id);
        const parentId = Graphs.findOne(id).parentId;
        if (parentId && !LibraryStates.graphList.find(x => x.uuid === parentId))
          loadGraphMetaData(parentId);

        const graph = findOneGraphMongo(id);

        this.readOnly = readOnly;
        this.graphId = id;

        this.changeDuration(graph ? graph.duration || 60 : 60, true);
        this.activityStore.all = findActivitiesMongo(
          { graphId: id },
          { reactive: false }
        ).map(
          x =>
            new Activity(
              x.plane,
              x.startTime,
              x.title,
              x.length,
              x.data,
              x.activityType,
              x._id,
              x.state
            )
        );

        this.operatorStore.all = findOperatorsMongo(
          { graphId: id },
          { reactive: false }
        ).map(
          x =>
            new Operator(
              x.time,
              x.y,
              x.type,
              x.data,
              x.operatorType,
              x._id,
              x.title,
              x.state
            )
        );

        this.connectionStore.all = Connections.find(
          { graphId: id },
          { reactive: false }
        )
          .fetch()
          .map(x => new Connection(x.source, x.target, x._id));

        this.ui.selected = null;
        this.history = [];
        window.setTimeout(() => mongoWatch(id));
        this.state = { mode: 'normal' };
        this.ui.setSidepanelOpen(true);
        this.templateSource = graph
          ? graph.templateSource
            ? graph.templateSource
            : null
          : null;
      }),

      addHistory: action(() => {
        if (!this.history || this.readOnly || this.state.mode === 'readOnly') {
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
        this.activityStore.setOrganizeNextState('compress');
      }),

      refreshValidate: action(() => {
        let validData = this.validate();
        if (validData.errors) {
          let change = 0;
          validData.errors
            .filter(x => x.type === 'needsGroupingKey')
            .forEach(x => {
              if (validData && validData.social[x.id]) {
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

        const broken =
          this.graphErrors.filter(x => x.severity === 'error').length > 0;
        if (
          Graphs.findOne(this.graphId) &&
          Graphs.findOne(this.graphId).broken !== broken
        ) {
          Graphs.update(this.graphId, {
            $set: {
              broken
            }
          });
        }
      }),

      undo: action(() => {
        const last = this.history.slice(this.history.length - 2);
        if (this.history.length > 1) {
          this.history.pop();
        }
        if (isEmpty(last)) {
          return;
        }

        const [connections, activities, operators] = last[0];

        this.activityStore.all = activities.map(
          x =>
            new Activity(
              x.plane,
              x.startTime,
              x.title,
              x.length,
              x.data,
              x.activityType,
              x.id
            )
        );
        this.operatorStore.all = operators.map(
          x =>
            new Operator(
              x.time,
              x.y,
              x.type,
              x.data,
              x.operatorType,
              x.id,
              x.title
            )
        );
        this.connectionStore.all = connections
          .map(x => new Connection(x.source, x.target, x._id))
          .filter(x => !!x);

        mergeGraph(this.objects);
      }),

      setSession: action((session: any) => {
        if (this.session.id !== session._id) {
          this.session.close();
          this.session = new Session(session);
        }
      }),

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
          graphDuration: this._graphDuration,
          broken:
            this.graphErrors.filter(x => x.severity === 'error').length > 0
        };
      }
    });
  }

  findId = ({ type, id }: { type: ElementTypes, id: string }): any => {
    if (type === 'activity') {
      return getOneId(this.activityStore.all, id);
    } else if (type === 'operator') {
      return getOneId(this.operatorStore.all, id);
    }
    return getOneId(this.connectionStore.all, id);
  };

  validate = () =>
    valid(
      Activities.find({ graphId: this.graphId }).fetch(),
      Operators.find({ graphId: this.graphId }).fetch(),
      Connections.find({ graphId: this.graphId }).fetch()
    );
}
const mongoWatch = graphId => {
  Activities.find({ graphId }).observe({
    added: store.activityStore.mongoAdd,
    changed: store.activityStore.mongoChange,
    removed: store.activityStore.mongoRemove
  });
  Connections.find({ graphId }).observe({
    added: store.connectionStore.mongoAdd,
    removed: store.connectionStore.mongoRemove
  });
  Operators.find({ graphId }).observe({
    added: store.operatorStore.mongoAdd,
    changed: store.operatorStore.mongoChange,
    removed: store.operatorStore.mongoRemove
  });
};
