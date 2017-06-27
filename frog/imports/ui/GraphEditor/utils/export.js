import Stringify from 'json-stringify-pretty-compact';
import fileDialog from 'file-dialog';
import FileSaver from 'file-saver';

import { Activities, Operators, Connections } from '../../../api/activities';
import { Graphs, addGraph, uploadGraph } from '../../../api/graphs';
import { getGlobalSetting, setGlobalSetting } from '../../../api/global';
import { store } from '../store';

const clean = obj => {
  const { graphId, ...ret } = obj; // eslint-disable-line no-unused-vars
  return ret;
};

const graphToString = graphId =>
  Stringify({
    graph: Graphs.find({ _id: graphId }).fetch()[0],
    activities: Activities.find({ graphId }).fetch().map(x => clean(x)),
    operators: Operators.find({ graphId }).fetch().map(x => clean(x)),
    connections: Connections.find({ graphId }).fetch().map(x => clean(x))
  });

export const exportGraph = () => {
  const blob = new Blob([graphToString(store.graphId)], {
    type: 'text/plain;charset=utf-8'
  });
  FileSaver.saveAs(blob, 'graph.json', true);
};

export const duplicateGraph = graphId =>
  doImportGraph({ target: { result: graphToString(graphId) } });

const doImportGraph = graphStr => {
  try {
    const graphObj = JSON.parse(graphStr.target.result);
    const importNo = getGlobalSetting('importNo') || 0;
    setGlobalSetting('importNo', importNo + 1);
    const graphId = addGraph(
      graphObj.graph.name + ' ' + importNo,
      graphObj.graph
    );
    const fixId = id => importNo + '-' + id;
    const specify = obj => ({ ...obj, _id: fixId(obj._id), graphId });
    uploadGraph({
      activities: graphObj.activities.map(specify),
      operators: graphObj.operators.map(specify),
      connections: graphObj.connections.map(specify).map(x => ({
        ...x,
        source: { ...x.source, id: fixId(x.source.id) },
        target: { ...x.target, id: fixId(x.target.id) }
      }))
    });
    store.setId(graphId);
  } catch (e) {
    window.alert('File has error, unable to import graph');
  }
};

export const importGraph = () => {
  fileDialog().then(file => {
    const fr = new FileReader();
    fr.onloadend = doImportGraph;
    fr.readAsText(file[0]);
  });
};
