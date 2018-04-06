import { uuid } from 'frog-utils';
import { Activities } from '/imports/api/activities';

const RemoteServer =
  Meteor.settings.public.remoteServer ||
  'http://icchilisrv4.epfl.ch:5000/activities';

export const removeActivity = (id: string) =>
  fetch(RemoteServer + '?uuid=eq.' + id, {
    method: 'DELETE'
  });

export const collectActivities = () =>
  fetch(RemoteServer + '?select=uuid,title,description,tags').then(e =>
    e.json()
  );

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
  props.setModal(false);
};
