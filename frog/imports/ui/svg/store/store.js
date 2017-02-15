import { computed, action, observable } from 'mobx';

import { drawPath } from '../utils/path';
import Activity from './activity';
import Connection from './connection';
import { between, pxToTime, timeToPx } from '../utils';
import getOffsets from '../utils/getOffsets';
import Operator from './operator';
import { mergeGraph, setCurrentGraph } from '../../../api/graphs';
import * as constants from '../constants';

import { Activities, Connections, Operators } from '../../../api/activities';

const getid = (arys, id) => {
  const joinedArys = arys.reduce((acc, x) => acc.concat(...x), []);
  const res = joinedArys.filter(x => x.id === id);
  return res && res[0];
};

const getOne = (coll, crit) => {
  const found = coll.filter(crit);
  if (found.size === 0) {
    return undefined;
  }
  return found[0];
};

const getOneId = (coll, id) => getOne(coll, x => x.id === id);

// find activities immediately to the left and to the right of the current activity
// to draw boundary markers and control movement by dragging and resizing
const calculateBounds = (activity, activities) => {
  const sorted = activities
    .filter(x => x.id !== activity.id)
    .sort((a, b) => a.startTime - b.startTime);
  const leftbound = sorted
    .filter(act => act.startTime <= activity.startTime)
    .pop();
  const rightbound = sorted
    .filter(act => act.startTime >= activity.startTime + activity.length)
    .shift();
  return [leftbound, rightbound];
};

export default class Store {
  findId = ({ type, id }) => {
    if (type === 'activity') {
      return getOneId(this.activities, id);
    } else if (type === 'operator') {
      return getOneId(this.operators, id);
    } else if (type === 'connection') {
      return getOneId(this.connections, id);
    }
    throw 'Wrong item type for findId!';
  };

  @observable id;
  @observable connections = [];
  @observable activities = [];
  @observable operators = [];
  @observable operatorType;
  @observable history = [];

  @action addHistory = () => {
    this.history.push([
      this.connections.map(x => ({ ...x })),
      this.activities.map(x => ({ ...x })),
      this.operators.map(x => ({ ...x }))
    ]);
    mergeGraph(this.objects);
  };

  @computed get canUndo() {
    return this.history.length > 0;
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
  @action updateSettings = settings =>
    this.overlapAllowed = settings.overlapAllowed;
  @observable currentlyOver;

  //* ***************************************
  @action mongoAddActivity = x => {
    if (!this.findId({ type: 'activity', id: x._id })) {
      this.activities.push(new Activity(
        x.plane,
        x.startTime,
        x.title,
        x.length,
        x._id
      ));
    }
  };

  @action mongoChangeActivity = (newact, oldact) => {
    this.findId({ type: 'activity', id: oldact._id }).update(newact);
  };

  @action mongoRemoveActivity = remact => {
    this.activities = this.activities.filter(x => x.id !== remact._id);
  };

  @action mongoAddOperator = x => {
    if (!this.findId({ type: 'operator', id: x._id })) {
      this.operators.push(new Operator(x.time, x.y, x.type, x._id));
    }
  };
  @action mongoChangeOperator = (newx, oldx) => {
    this.findId({ type: 'operator', id: oldx._id }).update(newx);
  };
  @action mongoRemoveOperator = remx => {
    this.operators = this.operators.filter(x => x.id !== remx._id);
  };

  @action mongoAddConnection = x => {
    if (!this.findId({ type: 'connection', id: x._id })) {
      this.connections.push(new Connection(
        this.findId(x.source),
        this.findId(x.target),
        x._id
      ));
    }
  };
  @action mongoRemoveConnection = remact => {
    this.connections = this.connections.filter(x => x.id !== remact._id);
  };

  @action setId = id => {
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
    cursors.activities.observe({
      added: this.mongoAddActivity,
      changed: this.mongoChangeActivity,
      removed: this.mongoRemoveActivity
    });
    cursors.connections.observe({
      added: this.mongoAddConnection,
      removed: this.mongoRemoveConnection
    });
    cursors.operators.observe({
      added: this.mongoAddOperator,
      changed: this.mongoChangeOperator,
      removed: this.mongoRemoveOperator
    });
  };
  //* ***************************************

  @observable mode = '';
  @observable draggingFrom;
  @observable draggingFromActivity;
  @observable dragCoords;

  // user begins dragging a line to make a connection
  @action startDragging = activity => {
    this.mode = 'dragging';
    let coords;
    if (activity instanceof Activity) {
      coords = [activity.xScaled + activity.widthScaled - 10, activity.y + 15];
    } else {
      // operator
      coords = [activity.xScaled + 30, activity.y + 30];
    }
    this.draggingFrom = [...coords];
    this.draggingFromActivity = activity;
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
    this.mode = '';
  };

  @action canvasClick = e => {
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
      this.mode = '';
      this.addHistory();
    }
    this.renameOpen = null;
  };

  @action unselect = () => {
    this.connections.forEach(x => x.selected = false);
    this.activities.forEach(x => x.selected = false);
    this.operators.forEach(x => x.selected = false);
  };

  @action dragging = (deltax: number, deltay: number): void =>
    this.dragCoords = [
      this.dragCoords[0] + deltax,
      this.dragCoords[1] + deltay
    ];
  @computed get dragPath() {
    return this.mode === 'dragging'
      ? drawPath(...this.draggingFrom, ...this.dragCoords)
      : null;
  }
  @action swapActivities = (left, right) => {
    right.startTime = left.startTime;
    left.startTime = right.startTime + right.length;
    this.addHistory();
  };
  @action stopDragging = () => {
    this.mode = '';
    const targetAry = this.activities
      .filter(x => x.over)
      .concat(this.operators.filter(x => x.over));
    if (
      targetAry.length > 0 && this.draggingFromActivity.id !== targetAry[0].id
    ) {
      this.connections.push(new Connection(
        this.draggingFromActivity,
        targetAry[0]
      ));
      this.addHistory();
    }
    this.cancelScroll();
  };

  @action setScale = x => {
    const oldscale = this.scale;
    this.scale = between(0.4, 3, x);

    const oldPanBoxSize = 250 / oldscale;
    const newPanBoxSize = 250 / this.scale;
    const needPanDelta = oldPanBoxSize / 2 - newPanBoxSize / 2;

    this.panDelta(needPanDelta);
  };

  // user has dropped line somewhere, clear out
  @action connectStop = () => {
    this.mode = null;
    this.cancelScroll();
    this.draggingFrom = [];
    this.dragCoords = [];
  };
  @observable scrollIntervalID;
  @action storeInterval = interval => {
    this.scrollIntervalID = interval;
  };
  @action cancelScroll = () => {
    if (this.scrollIntervalId) {
      window.clearInterval(this.scrollIntervalID);
    }
    this.scrollIntervalID = false;
  };

  @observable currentActivity;
  @observable leftbound;
  @observable rightbound;
  @observable renameOpen;
  @action rename(newTitle) {
    this.renameOpen.title = newTitle;
    this.renameOpen = null;
    this.addHistory();
  }

  @action startResizing = activity => {
    this.mode = 'resizing';
    this.currentActivity = activity;
    this.rightbound = calculateBounds(activity, this.activities)[1];
  };

  @action startMoving = activity => {
    this.mode = 'moving';
    this.currentActivity = activity;
    const [leftbound, rightbound] = calculateBounds(activity, this.activities);
    this.leftbound = leftbound;
    this.rightbound = rightbound;
    this.currentActivity.overdrag = 0;
  };

  @action stopMoving = () => {
    this.mode = '';
    this.addHistory();
    this.cancelScroll();
  };

  @action stopResizing = () => {
    this.mode = '';
    this.addHistory();
    this.cancelScroll();
  };

  @computed get scrollEnabled() {
    return !!['dragging', 'moving', 'resizing'].includes(this.mode);
  }

  // mouse pointer during line connection dragging
  @action connectDragDelta = (xdelta, ydelta) =>
    this.dragCoords = [xdelta, ydelta];

  @computed get activityOffsets() {
    const activities = this.activities;
    return [1, 2, 3].reduce(
      (acc, plane) => ({ ...acc, ...getOffsets(plane, activities) }),
      {}
    );
  }
  @observable scale = 1;

  @observable panx = 0;

  @action addActivity = (plane, rawX) => {
    const [x, _] = this.rawMouseToTime(rawX, 0);
    const newActivity = new Activity(plane, x, 'Unnamed', 5);
    this.activities.push(newActivity);
    this.renameOpen = newActivity;
    this.addHistory();
  };

  @computed get panTime() {
    return this.panx / 8.12;
  }

  @computed get rightEdgeTime() {
    return this.panTime + 31 / this.scale;
  }

  @observable socialCoordsTime = [];

  @action placeOperator = type => {
    if (!this.renameOpen) {
      this.mode = 'placingOperator';
      this.operatorType = type;
    }
  };

  rawMouseToTime = (rawX, rawY) => {
    const x = pxToTime(rawX - constants.GRAPH_LEFT, this.scale) + this.panTime;
    const y = rawY - constants.GRAPH_TOP;
    return [x, y];
  };

  @action socialMove = (rawX, rawY) => {
    this.socialCoordsTime = this.rawMouseToTime(rawX, rawY);
  };

  @computed get socialCoords() {
    const [rawX, y] = this.socialCoordsTime;
    const x = timeToPx(rawX, 1);
    return [x, y];
  }
  @computed get socialCoordsScaled() {
    const [rawX, y] = this.socialCoordsTime;
    const x = timeToPx(rawX, this.scale);
    return [x, y];
  }

  @action panDelta = deltaX => {
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
        const oldwidth = this.currentActivity.width;
        this.currentActivity.resize(deltaX * 4 * this.scale);
        if (oldwidth === this.currentActivity.width) {
          this.panx = oldpan;
        }
      }
      if (this.mode === 'moving') {
        const oldx = this.currentActivity.x;
        this.currentActivity.move(deltaX * 4 * this.scale);
        if (oldx === this.currentActivity.x) {
          this.panx = oldpan;
        }
      }
    }
  };

  @computed get panOffset() {
    return this.panx * 4 * this.scale;
  }

  @computed get objects() {
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
