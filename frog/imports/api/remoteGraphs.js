import { uuid } from 'frog-utils';
import { Graphs } from '/imports/api/graphs';
import { graphToString, doImportGraph } from '../ui/GraphEditor/utils/export';

const RemoteServer =
  Meteor.settings.public.remoteServer ||
  'http://icchilisrv4.epfl.ch:5000/graphs';

export const removeGraph = (id: string) =>
  fetch(RemoteServer + '?uuid=eq.' + id, {
    method: 'DELETE'
  });

export const collectGraphs = () =>
  fetch(RemoteServer + '?select=uuid,title,description,tags').then(e =>
    e.json()
  );

export const sendGraph = (state: Object, props: Object) => {
  const newId = uuid();
  const graph = {
    title: state.title,
    description: state.description,
    tags: '{' + state.tags.join(',') + '}',
    parent_id: Graphs.findOne(props.graphId).parentId,
    uuid: newId,
    graph: graphToString(props.graphId)
  };
  fetch(RemoteServer, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(graph)
  });
  Graphs.update(props.graphId, {
    $set: { parentId: newId }
  });
  props.setModal(false);
};

export const importGraph = (id: string) => {
  fetch(RemoteServer + '?uuid=eq.' + id)
    .then(e => e.json())
    .then(e => {
      const graphId = doImportGraph(e[0].graph);
      Graphs.update({ _id: graphId }, { $set: { parentId: id } });
    });
};
