import { uuid } from 'frog-utils';
import { Graphs } from '/imports/api/graphs';
import { graphToString, doImportGraph } from '../ui/GraphEditor/utils/export';

export const removeGraph = (id: string) =>
  fetch('http://icchilisrv4.epfl.ch:5000/graphs?uuid=eq.'.concat(id), {
    method: 'DELETE'
  });

export const collectGraphs = () =>
  fetch('http://icchilisrv4.epfl.ch:5000/graphs').then(e => e.json());

export const sendGraph = (state: Object, props: Object) => {
  const newId = uuid();
  const grph = {
    title: state.title,
    description: state.description,
    tags: '{'.concat(state.tags.join(',')).concat('}'),
    parent_id: Graphs.findOne(props.graphId).parentId,
    uuid: newId,
    graph: graphToString(props.graphId)
  };
  fetch('http://icchilisrv4.epfl.ch:5000/graphs', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(grph)
  });
  Graphs.update(props.graphId, {
    $set: { parentId: newId }
  });
  props.setModal(false);
};

export const importGraph = (id: string) => {
  fetch('http://icchilisrv4.epfl.ch:5000/graphs')
    .then(e => e.json())
    .then(e => {
      const graphId = doImportGraph(e.find(x => x.uuid === id).graph);
      Graphs.update({ _id: graphId }, { $set: { parentId: id } });
    });
};
