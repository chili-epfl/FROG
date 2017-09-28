import fileDialog from 'file-dialog';
import Stringify from 'json-stringify-pretty-compact';
import FileSaver from 'file-saver';
import { omit } from 'lodash';

import { Activities, Operators, Connections } from '../../../api/activities';
import { Graphs, addGraph } from '../../../api/graphs';
import { store } from '../store';

const clean = obj => {
  const { graphId, state, hasMergedData, ...ret } = obj; // eslint-disable-line no-unused-vars
  return ret;
};

const graphToString = graphId =>
  Stringify({
    graph: omit(Graphs.find({ _id: graphId }).fetch()[0], 'sessionId'),
    activities: Activities.find({ graphId }).fetch().map(x => clean(x)),
    operators: Operators.find({ graphId }).fetch().map(x => clean(x)),
    connections: Connections.find({ graphId }).fetch().map(x => clean(x))
  });

const cleanFilename = s =>
  s.replace(/[^a-z0-9_-]/gi, '_').replace(/_{2,}/g, '_');

export const exportGraph = () => {
  const name = Graphs.findOne(store.graphId).name;
  const blob = new Blob([graphToString(store.graphId)], {
    type: 'text/plain;charset=utf-8'
  });
  const fname = cleanFilename(name);
  FileSaver.saveAs(blob, fname + '.frog', true);
};

export const duplicateGraph = graphId =>
  doImportGraph({ target: { result: graphToString(graphId) } });

export const doImportGraph = graphStr => {
  try {
    const graphObj = JSON.parse(graphStr);
    const graphId = addGraph(graphObj);
    store.setId(graphId, false);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
    // eslint-disable-next-line no-alert
    window.alert('File has error, unable to import graph');
  }
};

export const importGraph = () => {
  fileDialog({ accept: '.frog' }).then(file => {
    const fr = new FileReader();
    fr.onloadend = e => doImportGraph(e.target.result);
    fr.readAsText(file[0]);
  });
};
