// @flow
import { Meteor } from 'meteor/meteor';
import { mergeSocialStructures, type ObjectT } from 'frog-utils';

import mergeData from './mergeData';
import reactiveToProduct from './reactiveToProduct';
import { operatorTypesObj } from '../imports/operatorTypes';
import { Products } from '../imports/api/products';
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
        : Promise.await(reactiveToProduct(connection.source.id))
  );

// The list of students
const getStudents = sessionId =>
  Meteor.users.find({ 'profile.currentSession': sessionId }).fetch();

// runDataflow ensures that all data required for a given node is
// computed. It recursively runs all the connecting nodes, and
// then the current node.
const runDataflow = (
  type: 'operator' | 'activity',
  nodeId: string,
  sessionId: string
) => {
  const nodeTypes = { operator: Operators, activity: Activities };
  nodeTypes[type].update(nodeId, { $set: { state: 'computing' } });
  const node = nodeTypes[type].findOne(nodeId);

  if (!node) {
    throw `Can't find node! ${type} ${nodeId}`;
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
  const socialStructure = mergeSocialStructures(
    socialStructures.map(x => x.socialStructure)
  );
  const products = allProducts.filter(c => c.type === 'product');
  const prod = products.length > 0 ? products[0] : null;

  // More data needed by the operators. Will need to be completed, documented and typed if possible
  const globalStructure = {
    studentIds: students.map(student => student._id)
  };

  const object: ObjectT = {
    activityData: prod && prod.activityData,
    socialStructure,
    globalStructure
  };

  addObject(nodeId, object);

  if (type === 'operator') {
    const operatorFunction = operatorTypesObj[node.operatorType].operator;
    const product = Promise.await(operatorFunction(node.data, object));

    const update = node.type === 'product'
      ? { activityData: product }
      : { socialStructure: product };
    Products.update(nodeId, { type: node.type, ...update }, { upsert: true });

    nodeTypes[type].update(nodeId, { $set: { state: 'computed' } });
  } else if (type === 'activity') {
    mergeData(nodeId, object);
    nodeTypes[type].update(nodeId, { $set: { state: 'computed' } });
  }
};

export default runDataflow;
