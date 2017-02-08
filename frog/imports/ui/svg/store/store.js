// @flow
import { computed, action, observable } from 'mobx';
type ModeT = 
  | { mode: 'dragging' | 'resizing', currentActivity: string} 
  | { mode: 'normal' }

const a: ModeT = {mode: 'normal'}
const b: ModeT = {mode: 'dragging', currentActivity: 'alfred'}

const c = ({mode: 'dragging', currentActivity}) => {
  console.log(currentActivity)
}
import { drawPath } from '../utils/path';
import ActivityStore from './activities'
import OperatorStore from './operators'
import ConnectionStore from './connections'
import { between, pxToTime, timeToPx } from '../utils';
import getOffsets from '../utils/getOffsets';
import Operator, { type OperatorTypes }  from './operator';
import { mergeGraph, setCurrentGraph } from '../../../api/graphs';
import * as constants from '../constants';

import { Activities, Connections, Operators } from '../../../api/activities';

type ElementTypes = 'operator' | 'activity' | 'connection'

type Elem = Activity | Connection | Operator
type Coll = Array<Elem>

type ModeT = 
  | { mode: 'resizing' | 'moving', currentActivity: Activity} 
  | { mode: 'dragging', draggingFrom: Activity | Operator }
  | { mode: 'placingOperator', operatorType: OperatorTypes }
  | { mode: 'normal' }

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
  findId = ({ type, id }: { type: ElementTypes, id: string }) => {
    if (type === 'activity') {
      return getOneId(this.activities, id);
    } else if (type === 'operator') {
      return getOneId(this.operators, id);
    }
    return getOneId(this.connections, id);
  };

  @observable GraphID: string;
  @observable connectionStore = new ConnectionStore;
  @observable activityStore = new ActivityStore;
  @observable operatorStore = new OperatorStore;
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
    this.activities = activities.map(
      x => new Activity(x.plane, x.startTime, x.title, x.length, x.id)
    );
    this.operators = operators.map(
      x => new Operator(x.time, x.y, x.type, x.id)
    );
    this.connections = connections.map(
      x =>
        new Connection(
          getid([this.operators, this.activities], x.source.id),
          getid([this.operators, this.activities], x.target.id)
        )
    );

    mergeGraph(this.objects);
  };

  @observable overlapAllowed = false;
  @action updateSettings = (settings: { overlapAllowed: boolean }) =>
    this.overlapAllowed = settings.overlapAllowed;
  @observable currentlyOver: boolean;

  //* ***************************************

  @action setId = (id: string) => {
    setCurrentGraph(id);
    this.id = id;
    this.activities = Activities.find({ graphId: id }, { reactive: false })
      .fetch()
      .map(x => new Activity(x.plane, x.startTime, x.title, x.length, x._id));

    this.operators = Operators.find({ graphId: id }, { reactive: false })
      .fetch()
      .map(x => new Operator(x.time, x.y, x.type, x._id));

    this.connections = Connections.find({ graphId: id }, { reactive: false })
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
    cursors.activities.observe(this.activityStore.mongoObservers)
    cursors.connections.observe(this.connectionStore.mongoObservers)
    cursors.operators.observe(this.operatorStore.mongoObservers)
  };
  //* ***************************************

  @observable mode: ModeT = {mode: 'normal'}
  @observable draggingFrom: Array<number>;

  // user begins dragging a line to make a connection
  @action startDragging = (activity: Activity | Operator): void => {
    this.mode = {mode: 'dragging', draggingFrom: activity}
    let coords;
    if (activity instanceof Activity) {
      coords = [activity.xScaled + activity.widthScaled - 10, activity.y + 15];
    } else {
      // operator
      coords = [activity.xScaled + 30, activity.y + 30];
    }
    this.draggingFrom = [...coords]; 
    this.dragCoords = [...coords];
  };

  @action deleteSelected = () => {
    const conn = this.connections.length;
    const act = this.activities.length;
    const opt = this.operators.length;
    const delActivity = this.activities.filter(x => x.selected);
    if (delActivity.length > 0) {
      const delAct = this.activities.filter(x => x.selected)[0];
      this.connections = this.connections.filter(
        x => x.target.id !== delAct.id && x.source.id !== delAct.id
      );
    } else {
      const delOperator = this.operators.filter(x => x.selected);
      if (delOperator.length > 0) {
        const delOpt = this.operators.filter(x => x.selected)[0];
        this.connections = this.connections.filter(
          x => x.target.id !== delOpt.id && x.source.id !== delOpt.id
        );
      }
    }
    this.connections = this.connections.filter(x => !x.selected);
    this.activities = this.activities.filter(x => !x.selected);
    this.operators = this.operators.filter(x => !x.selected);
    if (
      conn !== this.connections.length ||
      act !== this.activities.length ||
      opt !== this.operators.length
    ) {
      this.addHistory();
    }
  };

  @computed get hasSelection() {
    const sel = this.connections
      .concat(this.activities.concat(this.operators))
      .filter(x => x.selected);
    if (sel.length === 0) {
      return false;
    }
    const selection = sel[0];
    if (selection instanceof Activity) {
      return ['activity', selection];
    } else if (selection instanceof Operator) {
      return ['operator', selection];
    }
    return ['connection', selection];
  }

  @action cancelAll = () => {
    this.renameOpen = null;
    this.mode = {mode: 'normal'};
  };

  @action canvasClick = (e: {clientX: number, clientY: number}) => {
    if (this.mode === 'placingOperator') {
      const coords = this.rawMouseToTime(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      );
      this.operators.push(new Operator(
        coords[0],
        coords[1],
        this.operatorType
      ));
      this.mode = {mode: 'normal'};
      this.addHistory();
    }
    this.renameOpen = null;
  };

  @action unselect = () => {
    this.connections.forEach(x => x.selected = false);
    this.activities.forEach(x => x.selected = false);
    this.operators.forEach(x => x.selected = false);
  };

  @action dragging = (deltax: number, deltay: number): void => {
    this.dragCoords = [
      this.dragCoords[0] + deltax,
      this.dragCoords[1] + deltay
    ]
  };

  @computed get dragPath(): ?string {
    return this.mode === 'dragging'
      ? drawPath(...this.draggingFrom, ...this.dragCoords)
      : null;
  }
  @action swapActivities = (left: Activity, right: Activity) => {
    right.startTime = left.startTime;
    left.startTime = right.startTime + right.length;
    this.addHistory();
  };
  @action stopDragging = () => {
    this.mode = {mode: 'normal'};
    const targetAry = this
      .activities.filter(x => x.over)
      .concat(this.operators.filter(x => x.over));
    if (
      targetAry.length > 0 && this.draggingFromActivity.id !== targetAry[0].id
    ) {
      this.connections.push(
        new Connection(this.draggingFromActivity, targetAry[0])
      );
      this.addHistory();
    }
    this.cancelScroll();
  };

  @action setScale = (x: number): void => {
    const oldscale = this.scale;
    this.scale = between(0.4, 3, x);

    const oldPanBoxSize = 250 / oldscale;
    const newPanBoxSize = 250 / this.scale;
    const needPanDelta = oldPanBoxSize / 2 - newPanBoxSize / 2;

    this.panDelta(needPanDelta);
  };

  // user has dropped line somewhere, clear out
  @action connectStop = () => {
    this.mode = {mode: 'normal'};
    this.cancelScroll();
    this.dragCoords = [];
  };
  @observable scrollIntervalID: ?string;
  @action storeInterval = (interval: string) => {
    this.scrollIntervalID = interval;
  };
  @action cancelScroll = () => {
    if (this.scrollIntervalId) {
      window.clearInterval(this.scrollIntervalID);
    }
    this.scrollIntervalID = undefined;
  };

  @observable leftbound: ?Activity;
  @observable rightbound: ?Activity;
  @observable renameOpen: ?Activity;
  @action rename(newTitle: string) {
    if(this.renameOpen) {
      this.renameOpen.title = newTitle;
      this.renameOpen = null;
      this.addHistory();
    }
  }

  @action startResizing = (activity: Activity) => {
    this.mode = {mode: 'resizing', currentActivity: activity}
    this.rightbound = calculateBounds(activity, this.activities)[1];
  };

  @action startMoving = (activity: Activity) => {
    this.mode = {mode: 'moving', currentActivity: activity}
    const [leftbound, rightbound] = calculateBounds(activity, this.activities);
    this.leftbound = leftbound;
    this.rightbound = rightbound;
    activity.overdrag = 0;
  };

  @action stopMoving = () => {
    this.mode = {mode: 'normal'};
    this.addHistory();
    this.cancelScroll();
  };

  @action stopResizing = () => {
    this.mode = {mode: 'normal'};
    this.addHistory();
    this.cancelScroll();
  };

  @computed get scrollEnabled(): boolean {
    return !!['dragging', 'moving', 'resizing'].includes(this.mode);
  }

  // mouse pointer during line connection dragging
  @action connectDragDelta = (xdelta: number, ydelta: number): void => {
    this.dragCoords = [xdelta, ydelta];
  }

  @computed get activityOffsets(): any {
    const activities = this.activities;
    return [1, 2, 3].reduce(
      (acc, plane) => ({ ...acc, ...getOffsets(plane, activities) }),
      {}
    );
  }

  @observable scale = 1;

  @observable panx = 0;

  @action addActivity = (plane: number, rawX: number): void => {
    const [x, _] = this.rawMouseToTime(rawX, 0);
    const newActivity = new Activity(plane, x, 'Unnamed', 5);
    this.activities.push(newActivity);
    this.renameOpen = newActivity;
    this.addHistory();
  };

  @computed get panTime(): number {
    return this.panx / 8.12;
  }

  @computed get rightEdgeTime(): number {
    return this.panTime + 31 / this.scale;
  }

  @observable socialCoordsTime: [number, number] = [0, 0]

  @action placeOperator = (type: OperatorTypes): void => {
    if (!this.renameOpen) {
      this.mode = {mode: 'placingOperator', operatorType: type}
    }
  };

  rawMouseToTime = (rawX: number, rawY: number): [number, number] => {
    const x = pxToTime(rawX - constants.GRAPH_LEFT, this.scale) + this.panTime;
    const y = rawY - constants.GRAPH_TOP;
    return [x, y];
  };

  @action socialMove = (rawX: number, rawY: number): void => {
    this.socialCoordsTime = this.rawMouseToTime(rawX, rawY);
  };

  @computed get socialCoords(): [number, number] {
    const [rawX, y] = this.socialCoordsTime;
    const x = timeToPx(rawX, 1);
    return [x, y];
  }

  @computed get socialCoordsScaled(): [number, number] {
    const [rawX, y] = this.socialCoordsTime;
    const x = timeToPx(rawX, this.scale);
    return [x, y];
  }

  @action panDelta = (deltaX: number): void => {
    const oldpan = this.panx;
    const panBoxSize = 250 / this.scale;
    const rightBoundary = 1000 - panBoxSize;

    const newPan = this.panx + deltaX;
    this.panx = between(0, rightBoundary, newPan);

    if (oldpan !== this.panx) {
      if (this.mode === 'dragging') {
        this.dragCoords[0] += deltaX * 4 * this.scale;
      }
      if (this.mode === 'resizing') {
        const oldlength = this.mode.currentActivity.length;
        this.mode.currentActivity.resize(deltaX * 4 * this.scale);
        if (oldlength === this.mode.currentActivity.length) {
          this.panx = oldpan;
        }
      }
      if (this.mode === 'moving') {
        const oldx = this.mode.currentActivity.x;
        this.mode.currentActivity.move(deltaX * 4 * this.scale);
        if (oldx === this.mode.currentActivity.x) {
          this.panx = oldpan;
        }
      }
    }
  };

  @computed get panOffset(): number {
    return this.panx * 4 * this.scale;
  }

  @computed get objects(): any {
    return {
      activities: this.activities.map(x => ({ ...x.object, graphId: this.id })),
      operators: this.operators.map(x => ({ ...x.object, graphId: this.id })),
      connections: this.connections.map(x => ({
        ...x.object,
        graphId: this.id
      })),
      graphId: this.id
    };
  }
}
