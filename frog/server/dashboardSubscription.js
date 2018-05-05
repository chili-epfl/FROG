// @flow

import { Meteor } from 'meteor/meteor';
import { set, isEqual } from 'lodash';
import { uuid, cloneDeep, values } from 'frog-utils';

import { activityTypesObj } from '../imports/activityTypes';
import { DashboardData, Activities } from '../imports/api/activities';
import { DashboardStates } from '../imports/api/cache';
import { regenerateState } from '../imports/api/mergeLogData';
import { serverConnection } from './share-db-manager';

const interval = {};
const subscriptions = {};
const oldInput = {};
const activityQuery = {};

const reactiveWrapper = (act, dashboard) => {
  activityQuery[act._id] = serverConnection.createSubscribeQuery('rz', {
    _id: { $regex: '^' + act._id }
  });
  return (_, __) => {
    const data = (activityQuery[act._id].results || []).reduce(
      (acc, res) => ({
        [res.id.split('/')[1]]: res.data
      }),
      {}
    );
    return dashboard.reactiveToDisplay(data);
  };
};

const updateAndSend = (dashId, prepareDataForDisplayFn, activity, reactive) => {
  if (reactive || !isEqual(oldInput[dashId], DashboardStates[dashId])) {
    const dashState = cloneDeep(DashboardStates[dashId]);
    const newState = prepareDataForDisplayFn(dashState, activity);
    values(subscriptions[dashId]).forEach(that => {
      that.changed('dashboard', dashId, newState);
    });
    oldInput[dashId] = cloneDeep(DashboardStates[dashId]);
  }
};

export default () => {
  Meteor.publish('dashboard', function(activityId, activityType, dashboard) {
    const id = uuid();
    const dashId = activityId + '-' + dashboard;
    const aT = activityTypesObj[activityType];
    const act = Activities.findOne(activityId);
    if (DashboardStates[dashId] === undefined) {
      const archived = DashboardData.findOne({ dashId });
      if (archived) {
        this.added('dashboard', dashId, archived.data);
        this.ready();
        return;
      } else {
        regenerateState(aT, activityId, dashboard);
      }
    }
    set(subscriptions, [dashId, id], this);
    const aTDash = aT.dashboards[dashboard];
    let prepDataForDisplayFn;
    if (aTDash.prepareDataForDisplay) {
      prepDataForDisplayFn = aTDash.prepareDataForDisplay;
    } else if (aTDash.reactiveToDisplay) {
      prepDataForDisplayFn = reactiveWrapper(act, aTDash);
    } else {
      prepDataForDisplayFn = (x, _) => x;
    }
    const dashState = cloneDeep(DashboardStates[dashId]);
    const newState = prepDataForDisplayFn(dashState, act);
    this.added('dashboard', dashId, newState);
    oldInput[dashId] = cloneDeep(DashboardStates[dashId]);
    if (!interval[dashId]) {
      interval[dashId] = setInterval(
        () =>
          updateAndSend(
            dashId,
            prepDataForDisplayFn,
            act,
            aTDash.reactiveToDisplay
          ),
        1000
      );
    }
    this.ready();
    this.onStop(() => {
      delete subscriptions[dashId][id];
      if (Object.keys(subscriptions[dashId]).length === 0) {
        clearInterval(interval[dashId]);
        interval[dashId] = false;
      }
    });
  });
};
