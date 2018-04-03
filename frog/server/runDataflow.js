// @flow

import { Meteor } from 'meteor/meteor';
import {
  mergeSocialStructures,
  type ObjectT,
  type GlobalStructureT,
  type socialStructureT,
  type activityDataT
} from 'frog-utils';

import { Sessions } from '/imports/api/sessions';
import mergeData from './mergeData';
import reactiveToProduct from './reactiveToProduct';
import { operatorTypesObj } from '../imports/operatorTypes';
import { Products } from '../imports/api/products';
import { Graphs } from '../imports/api/graphs';
import { addObject } from '../imports/api/objects';

declare var Promise: any;

Meteor.methods({
  'dataflow.run': (type, nodeId, sessionId) =>
    runDataflow(type, nodeId, sessionId)
});

const runAllConnecting = (connections: Object[], sessionId: string) =>
  connections.map(
    connection =>
      connection.source.type === 'operator'
        ? runDataflow(connection.source.type, connection.source.id, sessionId)
        : Promise.await(reactiveToProduct(connection.source.id))
  );

// The list of students
const getStudents = sessionId => {
  const session = Sessions.findOne(sessionId);
  return Meteor.users.find({ joinedSessions: session.slug }).fetch();
};

// runDataflow ensures that all data required for a given node is
// computed. It recursively runs all the connecting nodes, and
// then the current node.
const runDataflow = (
  type: 'operator' | 'activity',
  nodeId: string,
  sessionId: string
) => {
  const graphId = Sessions.findOne(sessionId).graphId;
  const nodeTypes = { operator: 'operators', activity: 'activities' };
  const nodes = Graphs.findOne({ _id: graphId })[nodeTypes[type]];
  const node = nodes.find(x => x.id === nodeId);

  if (!node) {
    throw `Can't find node! ${type} ${nodeId}`;
  }
  if (node.state === 'computed') {
    // we're done here
    return;
  }
  const nodeT = nodes.find(x => x.id === nodeId);
  nodeT.state = 'computed';
  if (type === 'operator')
    Graphs.update(graphId, { $set: { operators: [...nodes, nodeT] } });
  else Graphs.update(graphId, { $set: { activities: [...nodes, nodeT] } });

  // first make sure all incoming nodes have been computed
  const connections = Graphs.findOne({ _id: graphId }).connections.filter(
    x => x.target.id === nodeId
  );

  runAllConnecting(connections, sessionId);

  const students = getStudents(sessionId);

  // Retrieve all products and merge
  const allProducts = connections.map(conn => Products.findOne(conn.source.id));

  // Merge all social structures
  const socialStructures = allProducts.filter(c => c && c.type === 'social');
  const socialStructure: socialStructureT = mergeSocialStructures(
    socialStructures.map(x => x.socialStructure)
  );

  // Extract the product
  const prod = allProducts.find(c => c.type === 'product');
  const activityData: activityDataT =
    prod && prod.activityData
      ? prod.activityData
      : {
          structure: 'all',
          payload: { all: { data: null, config: {} } }
        };

  // More data needed by the operators. Will need to be completed, documented and typed if possible
  const globalStructure: { studentIds: string[], students: Object } = {
    studentIds: students.map(student => student._id),
    students: students.reduce((acc, x) => ({ ...acc, [x._id]: x.username }), {})
  };

  const object: ObjectT & GlobalStructureT = {
    activityData,
    socialStructure,
    globalStructure
  };

  addObject(nodeId, object);

  if (type === 'operator') {
    const operatorFunction = operatorTypesObj[node.operatorType].operator;
    const product = Promise.await(operatorFunction(node.data, object));
    const dataType = {
      product: 'activityData',
      social: 'socialStructure',
      control: 'controlStructure'
    }[node.type];
    const update = { [dataType]: product };
    Products.update(nodeId, { type: node.type, ...update }, { upsert: true });

    Graphs.update(graphId, { $set: { operators: [...nodes, nodeT] } });
  } else if (type === 'activity') {
    mergeData(nodeId, object);
    Graphs.update(graphId, { $set: { activities: [...nodes, nodeT] } });
  }
};

export default runDataflow;
