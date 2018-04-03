import fileDialog from 'file-dialog';
import Stringify from 'json-stringify-pretty-compact';
import FileSaver from 'file-saver';
import { omit } from 'lodash';

import { Graphs, addGraph } from '../../../api/graphs';
import { store } from '../store';

const clean = obj => {
  const { graphId, state, hasMergedData, ...ret } = obj; // eslint-disable-line no-unused-vars
  return ret;
};

export const graphToString = graphId =>
  Stringify({
    graph: omit(Graphs.find({ _id: graphId }).fetch()[0], 'sessionId'),
    activities: Graphs.find({ _id: graphId }).activities.map(x => clean(x)),
    operators: Graphs.find({ _id: graphId }).operators.map(x => clean(x)),
    connections: Graphs.find({ _id: graphId }).connections.map(x => clean(x))
  });

const cleanFilename = s =>
  s.replace(/[^a-z0-9_-]/gi, '_').replace(/_{2,}/g, '_');

export const exportGraph = () => {
  const name = Graphs.findOne({ _id: store.graphId }).name;
  const blob = new Blob([graphToString(store.graphId)], {
    type: 'text/plain;charset=utf-8'
  });
  const fname = cleanFilename(name);
  FileSaver.saveAs(blob, fname + '.frog', true);
};

export const duplicateGraph = graphId =>
  doImportGraph({ target: { result: graphToString(graphId) } });

const doImportGraph = graphStr => {
  try {
    const graphObj = JSON.parse(graphStr.target.result);
    const graphId = addGraph(graphObj);
    store.setId(graphId);
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
    fr.onloadend = doImportGraph;
    fr.readAsText(file[0]);
  });
};
