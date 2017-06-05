import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';

import { operatorTypesObj } from '../operatorTypes';
import { activityTypesObj } from '../activityTypes';
import { Graphs } from './graphs';
import { Products } from './products';
import { Sessions } from './sessions';
import { Operators, Activities, Connections } from './activities';
import { engineLogger } from './logs';
import { addObject } from './objects';

const runAllConnecting = (nodeId, sessionId) => {
  console.log('run all connecting', nodeId);
  const connections = Connections.find({
    'target.id': nodeId
  }).fetch();
  connections.forEach(connection =>
    runDataflow(connection.source.type, connection.source.id, sessionId)
  );
  return connections;
};

// merges social structures, assumes no top level keys (groupings) overlap
const mergeSocialStructures = structures =>
  structures.reduce((acc, k) => ({ ...acc, ...k.product }), {});

// The list of students
const getStudents = sessionId =>
  Meteor.users.find({ 'profile.currentSession': sessionId }).fetch();

// runDataflow ensures that all data required for a given node is
// computed. It recursively runs all the connecting nodes, and
// then the current node.
const runDataflow = (type, nodeId, sessionId) => {
  if (Meteor.isClient) {
    return;
  } // don't run simulation in browser
  const nodeTypes = { operator: Operators, activity: Activities };
  console.log("runDataflow'", type, nodeId, sessionId);
  const node = nodeTypes[type].findOne(nodeId);
  if (node.computed) {
    // we're done here
    return;
  }

  // first make sure all incoming nodes have been computed
  const connections = runAllConnecting(nodeId, sessionId);

  const students = getStudents(sessionId);

  // Retrieve all products
  const allProducts = connections.map(conn => Products.findOne(conn.source.id));
  console.log('allProducts', allProducts);

  // Merge all social products
  const socialStructures = allProducts.filter(c => c.type === 'social');
  const socialStructure = mergeSocialStructures(socialStructures);

  const products = allProducts.filter(c => c.type === 'product');

  // More data needed by the operators. Will need to be completed, documented and typed if possible
  const globalStructure = {
    studentIds: students.map(student => student._id)
  };

  const object = {
    products,
    socialStructure,
    globalStructure
  };

  if (type === 'operator') {
    // We get the operator function from the operator package
    const operatorFunction = operatorTypesObj[node.operatorType].operator;
    // We run the operator function
    const product = operatorFunction(node.data, object);
    // The result of the operator function are written in Mongo
    console.log('updating product', product, nodeId);
    Products.update(nodeId, { type: node.type, product }, { upsert: true });
  } else if (type === 'activity') {
    // Here we build the object of an activity from the products of its connected nodes
    addObject(nodeId, object);
  }
  nodeTypes[type].update(nodeId, { $set: { computed: true } });

  return object;
};

export default runDataflow;
