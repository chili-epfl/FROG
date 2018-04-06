import { uuid } from 'frog-utils';
import { Activities } from '/imports/api/activities';

export const removeActivity = (id: string) =>
  fetch('http://icchilisrv4.epfl.ch:5000/activities?uuid=eq.'.concat(id), {
    method: 'DELETE'
  });

export const collectActivities = () =>
  fetch('http://icchilisrv4.epfl.ch:5000/activities')
    .then(e => e.json())


export const sendActivity = (state: Object, props: Object) => {
      const newId = uuid();
      const act = {
        title: state.title,
        description: state.description,
        config: { ...props.activity.data },
        tags: '{'.concat(state.tags.join(',')).concat('}'),
        parent_id: props.activity.parentId,
        uuid: newId,
        activity_type: props.activity.activityType
      };
      fetch('http://icchilisrv4.epfl.ch:5000/activities', {
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

export const importActivity =() => null
