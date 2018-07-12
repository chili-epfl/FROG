import fileDialog from 'file-dialog';
import Stringify from 'json-stringify-pretty-compact';
import FileSaver from 'file-saver';
import { omit } from 'lodash';

import { chainUpgrades } from 'frog-utils';
import { activityTypesObj } from '/imports/activityTypes';
import { operatorTypesObj } from '/imports/operatorTypes';
import { Activities, Operators, Connections } from '../../../api/activities';
import { Graphs, addGraph } from '../../../api/graphs';
import { store } from '../store';

const clean = obj => {
  const { graphId, state, hasMergedData, ...ret } = obj; // eslint-disable-line no-unused-vars
  return ret;
};

export const graphToString = graphId =>
  Stringify({
    graph: omit(Graphs.find({ _id: graphId }).fetch()[0], 'sessionId'),
    activities: Activities.find({ graphId })
      .fetch()
      .map(x => clean(x)),
    operators: Operators.find({ graphId })
      .fetch()
      .map(x => clean(x)),
    connections: Connections.find({ graphId })
      .fetch()
      .map(x => clean(x))
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

export const upgradeGraph = graph => {
  // only upgrade activities
  const newGraph = { ...graph };
  newGraph.activities = graph.activities.map(act => ({
    ...act,
    data: chainUpgrades(
      activityTypesObj[act.activityType].upgradeFunctions,
      act.configVersion || 1,
      activityTypesObj[act.activityType].configVersion
    )(act.data)
  }));
  newGraph.operators = graph.operators.map(op => ({
    ...op,
    data: chainUpgrades(
      operatorTypesObj[op.operatorType].upgradeFunctions,
      op.configVersion || 1,
      operatorTypesObj[op.operatorType].configVersion
    )(op.data)
  }));
  return newGraph;
};

export const doImportGraph = graphStr => {
  try {
    const graph = graphStr.target ? graphStr.target.result : graphStr;
    const graphObj = JSON.parse(graph);
    const graphId = addGraph(upgradeGraph(graphObj));
    store.setId(graphId);
    return graphId;
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
