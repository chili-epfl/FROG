import { uuid } from 'frog-utils';
import { Activities, addActivity } from '/imports/api/activities';
import { LibraryStates } from './cache';

const RemoteServer =
  Meteor.settings.public.remoteServer ||
  'https://icchilisrv4.epfl.ch:5500/activities';

export const removeActivity = (id: string, callback: ?Function) => {
  fetch(RemoteServer + '?uuid=eq.' + id, {
    method: 'DELETE'
  }).then(() => collectActivities(callback));
};

export const refreshActDate = () => (LibraryStates.lastRefreshAct = new Date());

export const collectActivities = (callback: ?Function) =>
  fetch(RemoteServer + '?select=uuid,title,description,tags,activity_type')
    .then(e => e.json())
    .then(r => {
      LibraryStates.activityList = r;
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

export const sendActivity = (state: Object, props: Object) => {
  const newId = uuid();
  const act = {
    title: state.title,
    description: state.description,
    config: { ...props.activity.data },
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
    description: state.description,
    tags: state.tags
  });
};

export const importAct = (id, activityId, callback, onSelect) => {
  fetch(RemoteServer + '?uuid=eq.' + id)
    .then(e => e.json())
    .then(e => {
      addActivity(e[0].activity_type, e[0].config, activityId, null, id);
      if (onSelect) onSelect({ id: e[0] });
      if (callback) {
        callback();
      }
    });
};
