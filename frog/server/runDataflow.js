import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid, promiseTimeout } from 'frog-utils';

import { mergeData } from './share-db-manager';
import { operatorTypesObj } from '../imports/operatorTypes';
import { activityTypesObj } from '../imports/activityTypes';
import { Graphs } from '../imports/api/graphs';
import { Products } from '../imports/api/products';
import { Sessions } from '../imports/api/sessions';
import { Operators, Activities, Connections } from '../imports/api/activities';
import { engineLogger } from '../imports/api/logs';
import { addObject } from '../imports/api/objects';

const log = (...e) => engineLogger(null, e);

Meteor.methods({
  'dataflow.run': (type, nodeId, sessionId) =>
    runDataflow(type, nodeId, sessionId)
});

const runAllConnecting = (connections, sessionId) => {
  return connections.map(connection =>
    runDataflow(connection.source.type, connection.source.id, sessionId)
  );
};

// merges social structures, assumes no top level keys (groupings) overlap
const mergeSocialStructures = (structures = []) =>
  structures.reduce((acc, k) => ({ ...acc, ...k.product }), {});

// The list of students
const getStudents = sessionId =>
  Meteor.users.find({ 'profile.currentSession': sessionId }).fetch();

// runDataflow ensures that all data required for a given node is
// computed. It recursively runs all the connecting nodes, and
// then the current node.
const runDataflow = (type, nodeId, sessionId) => {
  log('starting to run dataflow', nodeId);
  return new Promise((resolve, reject) => {
    log('inside promise');
    const nodeTypes = { operator: Operators, activity: Activities };
    const node = nodeTypes[type].findOne(nodeId);
    if (node.computed) {
      // we're done here
      log('node computed');
      return;
    }

    // first make sure all incoming nodes have been computed
    const connections = Connections.find({
      'target.id': nodeId
    }).fetch();
    log('running connecting', nodeId);
    Promise.all(runAllConnecting(connections, sessionId))
      .then(() => {
        const students = getStudents(sessionId);

        // Retrieve all products and merge
        const allProducts = connections.map(conn =>
          Products.findOne(conn.source.id)
        );

        // Merge all social products
        const socialStructures = allProducts.filter(c => c.type === 'social');
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

        log('going to split operator, activity', type);
        if (type === 'operator') {
          // We get the operator function from the operator package
          const operatorFunction = operatorTypesObj[node.operatorType].operator;
          // We run the operator function
          log('running operator function', node._id);
          const run = Promise.resolve(operatorFunction(node.data, object));
          promiseTimeout(5000, run)
            .then(product => {
              log('product', nodeId, product);
              Products.update(
                nodeId,
                { type: node.type, product },
                { upsert: true }
              );
              nodeTypes[type].update(nodeId, { $set: { computed: true } });
              log('going to resolve', node._id);
              resolve(object);
            })
            .catch(e => log('Promise error', e.stack));
        } else if (type === 'activity') {
          // Here we build the object of an activity from the products of its connected nodes
          log('going to merge data');
          log('object', nodeId, object);
          addObject(nodeId, object);
          mergeData(nodeId, object);
          nodeTypes[type].update(nodeId, { $set: { computed: true } });
          resolve();
        }
      })
      .catch(e => log('error', e));
  });
};

export default runDataflow;
