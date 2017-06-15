// @flow
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';
import type { socialStructureT, activityDataT } from 'frog-utils';

import mergeData from './mergeData';
import reactiveToProduct from './reactiveToProduct';
import { operatorTypesObj } from '../imports/operatorTypes';
import { activityTypesObj } from '../imports/activityTypes';
import { Graphs } from '../imports/api/graphs';
import { Products } from '../imports/api/products';
import { Sessions } from '../imports/api/sessions';
import { Operators, Activities, Connections } from '../imports/api/activities';
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
        : Promise.await(getReactiveData(connection.source.id))
  );

// The list of students
const getStudents = sessionId =>
  Meteor.users.find({ 'profile.currentSession': sessionId }).fetch();

// runDataflow ensures that all data required for a given node is
// computed. It recursively runs all the connecting nodes, and
// then the current node.
const runDataflow = (type, nodeId, sessionId) => {
  const nodeTypes = { operator: Operators, activity: Activities };
  nodeTypes[type].update(nodeId, { $set: { state: 'computing' } });
  const node = nodeTypes[type].findOne(nodeId);

  if (!node) {
    console.error("Can't find node!", type, nodeId);
    return;
  }
  if (node.state === 'computed') {
    // we're done here
    return;
  }

  // first make sure all incoming nodes have been computed
  const connections = Connections.find({
    'target.id': nodeId
  }).fetch();

  runAllConnecting(connections, sessionId);

  const students = getStudents(sessionId);

  // Retrieve all products and merge
  const allProducts = connections.map(conn => Products.findOne(conn.source.id));

  // Merge all social products
  const socialStructures = allProducts.filter(c => c && c.type === 'social');
  const socialStructure = mergeSocialStructures(socialStructures);

  let products = allProducts.filter(c => c.type === 'product');
  if (products.length > 0) {
    products = products[0].product;
  }

  // More data needed by the operators. Will need to be completed, documented and typed if possible
  const globalStructure = {
    studentIds: students.map(student => student._id)
  };

  const object = {
    products,
    socialStructure,
    globalStructure
  };

  addObject(nodeId, object);

  if (type === 'operator') {
    const operatorFunction = operatorTypesObj[node.operatorType].operator;
    const product = Promise.await(operatorFunction(node.data, object));
    Products.update(nodeId, { type: node.type, product }, { upsert: true });
    nodeTypes[type].update(nodeId, { $set: { state: 'computed' } });
  } else if (type === 'activity') {
    mergeData(nodeId, object);
    nodeTypes[type].update(nodeId, { $set: { state: 'computed' } });
  }
};

export default runDataflow;
