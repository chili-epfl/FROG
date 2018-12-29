import { omitBy, isNil } from 'lodash';

import { uuid, chainUpgrades } from 'frog-utils';

import { activityTypesObj } from '../activityTypes';
import { Activities, addActivity } from '../api/activities';
import { LibraryStates } from './cache';

const RemoteServer =
  Meteor.settings.public.remoteServer ||
  'https://icchilisrv4.epfl.ch:5500/activities';

export const removeActivity = (id: string, callback: ?Function) => {
  fetch(RemoteServer + '?uuid=eq.' + id, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ deleted: true })
  }).then(() => collectActivities(callback));
};

export const updateActivity = (
  id: string,
  activity: Object,
  callback: ?Function
) => {
  const act = omitBy(
    {
      title: activity.title,
      description: activity.description,
      config: { ...activity.data },
      tags: '{' + activity.tags.join(',') + '}',
      is_public: activity.public
    },
    isNil
  );
  fetch(RemoteServer + '?uuid=eq.' + id, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(act)
  }).then(() => collectActivities(callback));
};

export const refreshActDate = () => (LibraryStates.lastRefreshAct = new Date());

export const collectActivities = (callback: ?Function) =>
  fetch(
    RemoteServer +
      '?select=uuid,title,description,tags,activity_type,owner_id,timestamp,is_public&deleted=not.is.true&or=(is_public.not.is.false,owner_id.eq.' +
      Meteor.user().username +
      ')'
  )
    .then(e => e.json())
    .then(r => {
      LibraryStates.activityList = r.filter(x => !x.deleted);
      refreshActDate();
      if (callback) callback();
    });

export const checkDateAct = (callback: ?Function) => {
  if (
    !LibraryStates.lastRefreshAct ||
    new Date() - LibraryStates.lastRefreshAct > 60000
  ) {
    collectActivities(callback);
  }
};

export const sendActivity = (state: Object, props: Object, id: string) => {
  const newId = id || uuid();
  const act = {
    title: state.title,
    description: state.description,
    owner_id: Meteor.user().username,
    config: activityTypesObj[props.activity.activityType].upgradeFunctions
      ? chainUpgrades(
          activityTypesObj[props.activity.activityType].upgradeFunctions,
          props.activity.configVersion || 1,
          activityTypesObj[props.activity.activityType].configVersion
        )(props.activity.data)
      : props.activity.data,
    config_version: activityTypesObj[props.activity.activityType].configVersion,
    is_public: state.public,
    tags: '{' + state.tags.join(',') + '}',
    parent_id: props.activity.parentId,
    uuid: newId,
    activity_type: props.activity.activityType
  };
  fetch(RemoteServer, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(act)
  });
  Activities.update(props.activity._id, {
    $set: { parentId: newId }
  });
  LibraryStates.activityList.push({
    uuid: newId,
    title: state.title,
    owner_id: Meteor.user().username,
    description: state.description,
    tags: state.tags
  });
};

export const loadActivityMetaData = (id: string, callback: ?Function) => {
  fetch(
    RemoteServer +
      '?uuid=eq.' +
      id +
      '&select=id,title,description,tags,owner_id,is_public'
  )
    .then(e => e.json())
    .then(e => {
      const toChangeIdx = LibraryStates.activityList.findIndex(
        x => x.uuid === id
      );
      if (toChangeIdx !== -1) {
        LibraryStates.activityList[toChangeIdx] = {
          uuid: id,
          title: e[0].title,
          owner_id: e[0].owner_id,
          description: e[0].description,
          tags: e[0].tags,
          public: e[0].is_public
        };
      } else
        LibraryStates.activityList.push({
          uuid: id,
          title: e[0].title,
          owner_id: e[0].owner_id,
          description: e[0].description,
          tags: e[0].tags,
          public: e[0].is_public
        });
      if (callback) {
        callback();
      }
    });
};

export const importAct = (id, activityId, callback, onSelect) => {
  fetch(RemoteServer + '?uuid=eq.' + id)
    .then(e => e.json())
    .then(e => {
      addActivity(
        e[0].activity_type,
        e[0].config,
        activityId,
        e[0].configVersion,
        null,
        id
      );
      if (onSelect) onSelect({ id: e[0] });
      if (callback) {
        callback(e[0]);
      }
    });
};
