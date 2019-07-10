import fileDialog from 'file-dialog';
import Stringify from 'json-stringify-pretty-compact';
import FileSaver from 'file-saver';
import { omit } from 'lodash';

import { findActivitiesMongo, Connections } from '/imports/api/activities';
import { findOperatorsMongo } from '/imports/api/operators';
import { addGraph, findOneGraphMongo } from '/imports/api/graphs';

const clean = obj => {
  const { graphId, state, templateRZCloned, hasMergedData, ...ret } = obj; // eslint-disable-line no-unused-vars
  return ret;
};

export const graphToString = graphId =>
  Stringify({
    graph: omit(findOneGraphMongo(graphId), 'sessionId'),
    activities: findActivitiesMongo({ graphId }).map(x => clean(x)),
    operators: findOperatorsMongo({ graphId }).map(x => clean(x)),
    connections: Connections.find({ graphId })
      .fetch()
      .map(x => clean(x))
  });

const cleanFilename = s =>
  s.replace(/[^a-z0-9_-]/gi, '_').replace(/_{2,}/g, '_');

export const exportGraph = (store: Object) => {
  const name = findOneGraphMongo(store.graphId).name;
  const blob = new Blob([graphToString(store.graphId)], {
    type: 'text/plain;charset=utf-8'
  });
  const fname = cleanFilename(name);
  FileSaver.saveAs(blob, fname + '.frog', true);
};

export const duplicateGraph = (store, graphId) =>
  doImportGraph(store, { target: { result: graphToString(graphId) } });

export const doImportGraph = (
  store?: Object,
  graphStr: string,
  title?: string
) => {
  try {
    const graph = graphStr?.target ? graphStr?.target?.result : graphStr;
    const graphObj = JSON.parse(graph);
    if (title) {
      graphObj.graph.name = title;
    }
    const graphId = addGraph(graphObj);
    if (store) {
      store.setId(graphId);
    }
    return graphId;
  } catch (e) {
    console.warn(e);
    // eslint-disable-next-line no-alert
    window.alert('File has error, unable to import graph');
  }
};

export const importGraph = store => {
  fileDialog({ accept: '.frog' }).then(file => {
    const fr = new FileReader();
    fr.onloadend = e => doImportGraph(store, e);
    fr.readAsText(file[0]);
  });
};
